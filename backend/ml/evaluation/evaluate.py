"""
AI Crop Disease Detection - Model Evaluation Module
Evaluates a trained TensorFlow model on test images and calculates
classification metrics (accuracy, precision, recall, confusion matrix).
"""

import os
import sys
import json
import argparse
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(BASE_DIR))

def evaluate_model(model_path: str, test_dir: str):
    try:
        import tensorflow as tf
        import numpy as np
    except ImportError:
        print("[ERROR] TensorFlow is required for model evaluation.")
        return

    if not os.path.exists(model_path):
        print(f"[ERROR] Model file not found at: {model_path}")
        return

    if not os.path.exists(test_dir):
        print(f"[WARNING] Test dataset directory '{test_dir}' not found.")
        print("To evaluate, supply a test directory with labeled subfolders.")
        return

    print(f"Loading model: {model_path}")
    model = tf.keras.models.load_model(model_path)

    test_ds = tf.keras.utils.image_dataset_from_directory(
        test_dir,
        image_size=(224, 224),
        batch_size=32,
        label_mode='categorical',
        shuffle=False
    )

    results = model.evaluate(test_ds, verbose=1)
    metrics_dict = dict(zip(model.metrics_names, results))
    print(f"\n--- Evaluation Results ---")
    for k, v in metrics_dict.items():
        print(f"{k}: {v:.4f}")

    eval_out = BASE_DIR / "ml" / "evaluation" / "eval_results.json"
    os.makedirs(eval_out.parent, exist_ok=True)
    with open(eval_out, "w", encoding="utf-8") as f:
        json.dump(metrics_dict, f, indent=2)
    print(f"Saved metrics to: {eval_out}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate Crop Disease Model")
    parser.add_argument("--model", type=str, default="./ml/model/crop_disease_model.keras")
    parser.add_argument("--test_dir", type=str, default="./dataset/test")
    args = parser.parse_args()

    evaluate_model(args.model, args.test_dir)
