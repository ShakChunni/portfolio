# BdSL Emergency Triage Translation (Research)

This repository is an early-stage research codebase for building a **real-time, offline, bidirectional Bengali Sign Language (BdSL) translation system** focused on emergency medical triage use cases.

The current implementation covers **Stages 1–5** of the pilot pipeline: raw video audit, MediaPipe keypoint extraction, dataset tensor assembly, baseline LSTM training, and held-out evaluation. TFLite export is intentionally deferred until the 6-class pilot shows believable evaluation results.

## Current Status

Implemented:

- Automated class-wise video capture: `scripts/collect_triage_videos.py`
- Shared project configuration: `config.py`
- **Stage 1** — Raw video audit: `scripts/audit_videos.py`
- **Stage 2** — MediaPipe keypoint extraction: `scripts/extract_keypoints.py`
- **Stage 3** — Dataset tensor assembly: `scripts/build_dataset.py`
- **Stage 4** — Baseline LSTM training: `scripts/train_model.py`
- **Stage 5** — Held-out evaluation: `scripts/evaluate_model.py`

Safety guards:

- `audit_videos.py` excludes `camera_probe_test` and `.DS_Store`, flags corrupt/too-short/too-dark clips, and warns when fewer than 2 real classes exist.
- `build_dataset.py` validates every `.npy` shape, replaces NaN/Inf with `0.0` after logging, and prints a single-class warning.
- `train_model.py` **refuses** to train on fewer than 2 classes by default. Use `--allow-single-class-smoke-test` only for an explicit pipeline smoke test.
- `evaluate_model.py` **refuses** to run if no trained model or no test split exists. x

## Repository Layout

```text
research/
├── config.py                        # Shared constants and paths
├── scripts/
│   ├── collect_triage_videos.py     # Stage 0: data collection (webcam)
│   ├── audit_videos.py              # Stage 1: raw video audit
│   ├── extract_keypoints.py         # Stage 2: MediaPipe keypoint extraction
│   ├── build_dataset.py             # Stage 3: dataset tensor assembly
│   ├── train_model.py               # Stage 4: baseline LSTM training
│   └── evaluate_model.py            # Stage 5: held-out evaluation
├── triage_dataset/
│   └── <class_name>/
│       ├── 0.mp4
│       ├── 1.mp4
│       └── ...
├── data/
│   ├── audits/
│   │   ├── video_audit.csv
│   │   └── video_audit_summary.json
│   ├── keypoints/
│   │   └── <class_name>/
│   │       ├── 0.npy
│   │       └── ...
│   └── dataset/
│       ├── X.npy                    # (N, SEQUENCE_LENGTH, NUM_FEATURES)
│       ├── y.npy                    # (N,)
│       ├── label_map.json
│       ├── manifest.csv
│       └── split_manifest.csv
├── models/
│   ├── bdsl_lstm_pilot_v1_best.keras
│   ├── bdsl_lstm_pilot_v1_final.keras
│   └── holistic_landmarker.task     # Auto-downloaded by extract_keypoints.py
├── logs/
│   └── training_log_pilot_v1.csv
└── results/
    ├── evaluation_pilot_v1.json
    ├── classification_report_pilot_v1.txt
    ├── confusion_matrix_pilot_v1.png
    ├── accuracy_curve_pilot_v1.png
    └── loss_curve_pilot_v1.png
```

## Requirements

- Python 3.10-3.12
- macOS / Linux / Windows with a webcam for data collection
- OpenCV, NumPy, MediaPipe, scikit-learn, matplotlib, TensorFlow

Use one project virtual environment named `venv`. TensorFlow does not currently support Python 3.14 in this repo, so the default local environment uses Python 3.12.

## Environment Setup

The same `venv` is used for all stages. The only difference between platforms is which TensorFlow package file gets installed.

### macOS Apple Silicon

```bash
brew install python@3.12
bash scripts/setup_venv.sh
source venv/bin/activate
```

This installs:

```bash
pip3 install -r requirements-tf-macos.txt
```

On this machine, `venv` verified:

```text
Python: 3.12.13
TensorFlow: 2.16.2
GPU devices: [PhysicalDevice(name='/physical_device:GPU:0', device_type='GPU')]
```

### Windows Native CPU

Native Windows GPU support ended after TensorFlow 2.10. For a normal Windows CPU setup:

```powershell
py -3.12 -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements-tf-windows.txt
```

Or run the helper script:

```powershell
.\scripts\setup_venv.ps1
```

### Windows WSL2 GPU

For NVIDIA GPU training on Windows, use WSL2 and install:

```bash
python3.12 -m venv venv
source venv/bin/activate
python3 -m pip install --upgrade pip setuptools wheel
python3 -m pip install -r requirements-tf-wsl2.txt
```

TensorFlow’s official guidance is that GPU training on modern Windows should use WSL2, while native Windows can use CPU TensorFlow.

## Data Collection

From the repository root, with the virtual environment active:

```bash
python3 scripts/collect_triage_videos.py
```

The script prompts for `CLASS_NAME` and `NUMBER_OF_VIDEOS`, then stores clips under `triage_dataset/<class_name>/`.

Controls while the OpenCV capture window is focused:

- `p`: pause/resume timer or recording
- `r`: restart the current clip and discard the partial file
- `q`: quit safely

## Pipeline Commands

From the repository root, with the virtual environment active:

### One-class smoke test (Stages 1–3 only)

With only `joururi-doctor-dorkar` collected, this validates the data plumbing end-to-end without ever training a model:

```bash
python3 scripts/audit_videos.py
python3 scripts/extract_keypoints.py
python3 scripts/build_dataset.py
```

Expected:

- 50 OK videos, 1 real class, `camera_probe_test` excluded.
- 50 `.npy` files in `data/keypoints/joururi-doctor-dorkar/`, each of shape `(60, 1692)`.
- `X.npy` shape `(50, 60, 1692)`, `y.npy` shape `(50,)`, label map with one class.
- A warning that 1 class is not enough for training.

### Full pilot (Stages 1–5, requires 2+ classes)

After collecting data for at least one more class:

```bash
python3 scripts/audit_videos.py
python3 scripts/extract_keypoints.py
python3 scripts/build_dataset.py
python3 scripts/train_model.py
python3 scripts/evaluate_model.py
```

**Do not run `train_model.py` on a single class.** It will refuse with a clear message. If you intentionally want a degenerate smoke test, pass `--allow-single-class-smoke-test`.

## Stage Details

### Stage 1 — `scripts/audit_videos.py`

Scans `triage_dataset/`, validates every `.mp4`, and writes:

- `data/audits/video_audit.csv` — one row per clip with shape, FPS, duration, black-frame ratio, status.
- `data/audits/video_audit_summary.json` — class counts, OK/problem totals, threshold definitions.

Status values: `ok`, `unreadable`, `too_short`, `too_dark`, `wrong_extension`. Thresholds live in `config.py` (`MIN_DURATION_SECONDS`, `MAX_BLACK_FRAME_RATIO`).

### Stage 2 — `scripts/extract_keypoints.py`

Uses **MediaPipe Tasks API** (`HolisticLandmarker`) to convert each `.mp4` into a fixed-length `(60, 1692)` keypoint sequence:

- Face: 478 landmarks × `(x, y, z)` = 1434
- Pose: 33 landmarks × `(x, y, z, visibility)` = 132
- Left hand: 21 landmarks × `(x, y, z)` = 63
- Right hand: 21 landmarks × `(x, y, z)` = 63
- **Total: 1692 features per frame**

The 478-point face mesh is what the new `HolisticLandmarker` produces; this is **not** the same as the legacy 468-point face from `mp.solutions.holistic` (removed in MediaPipe 0.10.30+). The model file (`models/holistic_landmarker.task`) is auto-downloaded on first run.

Missing landmark groups (e.g. hands out of frame) are **zero-filled**, not dropped. NaN/Inf are replaced with `0.0` after logging. The script skips `.npy` outputs that already exist with the correct shape and overwrites ones with the wrong shape.

### Stage 3 — `scripts/build_dataset.py`

Loads every `.npy` and writes:

- `data/dataset/X.npy` — `(N, 60, 1692)`, `float32`
- `data/dataset/y.npy` — `(N,)`, `int32`
- `data/dataset/label_map.json` — `{class_name: int_label}` (alphabetically sorted)
- `data/dataset/manifest.csv` — per-sample provenance + health counts

Class names are sorted alphabetically so labels are deterministic across runs.

### Stage 4 — `scripts/train_model.py`

Small 2-LSTM baseline classifier:

```text
Input(shape=(60, 1692))
LSTM(64, return_sequences=True)
LSTM(64)
Dense(64, relu)
Dropout(0.4)
Dense(num_classes, softmax)
```

- Stratified train / val / test split.
- All seeds locked (`PYTHONHASHSEED`, Python `random`, NumPy, TensorFlow).
- Callbacks: `ModelCheckpoint` (best by `val_accuracy`), `EarlyStopping` (`patience=30`, `restore_best_weights=True`), `CSVLogger`, `ReduceLROnPlateau`.
- Saves `models/bdsl_lstm_pilot_v1_best.keras` and `_final.keras`, `logs/training_log_pilot_v1.csv`, `results/accuracy_curve_pilot_v1.png`, `results/loss_curve_pilot_v1.png`, `data/dataset/split_manifest.csv`.
- **Refuses to train on 1 class** unless `--allow-single-class-smoke-test` is passed.

### Stage 5 — `scripts/evaluate_model.py`

Loads the best model and evaluates on the `test` rows of `split_manifest.csv`. Writes:

- `results/evaluation_pilot_v1.json` — full machine-readable metrics (per-class precision/recall/F1, confusion matrix, test loss/accuracy).
- `results/classification_report_pilot_v1.txt` — sklearn classification report.
- `results/confusion_matrix_pilot_v1.png` — labeled confusion matrix heatmap.

Refuses to run if the trained model is missing or if `split_manifest.csv` has zero test rows.

## Research Roadmap (High-Level)

1. Collect class-balanced raw `.mp4` samples (currently 1 class × 50 clips).
2. Extract MediaPipe Holistic landmarks (Stage 2).
3. Build fixed-length sequence tensors with a label map (Stage 3).
4. Train a baseline sequence model and evaluate on a held-out test split (Stages 4–5).
5. After 6+ classes show believable results: add keypoint-level augmentation, then TFLite export for mobile deployment.
6. Bidirectional text → sign and sign → text integration (future work).

## Disclaimer

This project is a research system under active development. It is **not** a medical device and should not be used for clinical decision-making in its current state.
