"""
AI Crop Disease Detection - Model Architecture & Builder
Builds a transfer-learning CNN architecture based on MobileNetV2 backbone
with custom multi-class classification head for 32 crop disease classes.
"""

import json
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

def build_crop_disease_model(num_classes: int = 32, input_shape: tuple = (224, 224, 3)):
    """
    Constructs the TensorFlow Keras CNN architecture.
    Uses MobileNetV2 pretrained feature extractor with custom dense classification head.
    """
    try:
        import tensorflow as tf
        from tensorflow.keras import layers, models

        base_model = tf.keras.applications.MobileNetV2(
            input_shape=input_shape,
            include_top=False,
            weights='imagenet'
        )
        base_model.trainable = False  # Freeze base layers for initial feature extraction

        model = models.Sequential([
            layers.Input(shape=input_shape),
            layers.Rescaling(1./255),  # Normalization to [0, 1]
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.BatchNormalization(),
            layers.Dropout(0.3),
            layers.Dense(256, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.2),
            layers.Dense(num_classes, activation='softmax', name='disease_predictions')
        ])

        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
            loss='categorical_crossentropy',
            metrics=['accuracy', tf.keras.metrics.TopKCategoricalAccuracy(k=3, name='top_3_acc')]
        )
        return model
    except ImportError:
        print("TensorFlow not yet installed in active runtime. Model architecture definition preserved.")
        return None

def export_initial_model(output_path: str = None):
    """
    Exports initialized model architecture to disk.
    """
    if output_path is None:
        output_path = str(BASE_DIR / "model" / "crop_disease_model.keras")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    model = build_crop_disease_model()
    if model is not None:
        model.save(output_path)
        print(f"Model successfully built and exported to {output_path}")
        return output_path
    else:
        print("Export skipped: TensorFlow is pending installation.")
        return None

if __name__ == "__main__":
    export_initial_model()
