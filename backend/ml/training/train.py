"""
AI Crop Disease Detection - Model Training Pipeline
Trains a CNN / MobileNetV2 transfer learning model on plant leaf disease datasets (e.g. PlantVillage).
Supports dataset loading, data augmentation, train/validation split, learning rate scheduling,
early stopping, and exporting to Keras/SavedModel format.
"""

import os
import sys
import json
import argparse
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(BASE_DIR))

def train_model(
    dataset_dir: str,
    output_model_path: str = None,
    epochs: int = 15,
    batch_size: int = 32,
    learning_rate: float = 1e-4,
    img_size: tuple = (224, 224)
):
    """
    Executes complete training procedure using TensorFlow & Keras.
    """
    try:
        import tensorflow as tf
        from tensorflow.keras import layers, models, callbacks
        from ml.model_builder import build_crop_disease_model
    except ImportError:
        print("[ERROR] TensorFlow is required for running the training pipeline.")
        print("Please install tensorflow: pip install tensorflow")
        sys.exit(1)

    output_model_path = output_model_path or str(BASE_DIR / "ml" / "model" / "crop_disease_model.keras")
    os.makedirs(os.path.dirname(output_model_path), exist_ok=True)

    print(f"Loading training dataset from: {dataset_dir}")
    if not os.path.exists(dataset_dir):
        print(f"[WARNING] Dataset directory '{dataset_dir}' does not exist.")
        print("To train on a custom dataset, organize images into class subdirectories:")
        print("  dataset_dir/tomato_early_blight/image1.jpg")
        print("  dataset_dir/tomato_healthy/image2.jpg")
        print("  ...")
        print("Step marked: Real dataset folder must be supplied to execute training.")
        return

    # Data augmentation pipeline
    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.15),
        layers.RandomZoom(0.1),
        layers.RandomContrast(0.1),
    ], name="data_augmentation")

    train_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="training",
        seed=1337,
        image_size=img_size,
        batch_size=batch_size,
        label_mode='categorical'
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="validation",
        seed=1337,
        image_size=img_size,
        batch_size=batch_size,
        label_mode='categorical'
    )

    class_names = train_ds.class_names
    num_classes = len(class_names)
    print(f"Discovered {num_classes} classes: {class_names}")

    # Prefetching for performance
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.map(lambda x, y: (data_augmentation(x, training=True), y), num_parallel_calls=AUTOTUNE)
    train_ds = train_ds.cache().prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    # Instantiate model architecture
    model = build_crop_disease_model(num_classes=num_classes, input_shape=(*img_size, 3))
    model.summary()

    # Training Callbacks
    callback_list = [
        callbacks.EarlyStopping(
            monitor="val_loss",
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.3,
            patience=2,
            min_lr=1e-6,
            verbose=1
        ),
        callbacks.ModelCheckpoint(
            filepath=output_model_path,
            monitor="val_accuracy",
            save_best_only=True,
            verbose=1
        )
    ]

    print(f"Starting model training for {epochs} epochs...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs,
        callbacks=callback_list
    )

    # Save final trained model
    model.save(output_model_path)
    print(f"Trained model exported successfully to: {output_model_path}")

    # Save updated labels mapping if needed
    labels_file = BASE_DIR / "ml" / "labels_trained.json"
    with open(labels_file, "w", encoding="utf-8") as f:
        json.dump({"class_names": class_names, "history": history.history}, f, indent=2)
    print(f"Training history and classes saved to {labels_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Crop Disease CNN Model")
    parser.add_argument("--dataset_dir", type=str, default="./dataset", help="Path to dataset root folder")
    parser.add_argument("--output", type=str, default=None, help="Output .keras model destination")
    parser.add_argument("--epochs", type=int, default=15, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=32, help="Batch size")
    args = parser.parse_args()

    train_model(dataset_dir=args.dataset_dir, output_model_path=args.output, epochs=args.epochs, batch_size=args.batch_size)
