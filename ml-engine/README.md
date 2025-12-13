# ML Pricing Engine - Project Setup

## Quick Start

```bash
# Navigate to ml-engine
cd ml-engine

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment config
cp .env.example .env
# Edit .env with your database credentials

# Start Jupyter for data exploration
jupyter notebook notebooks/01_data_exploration.ipynb
```

## Project Structure

```
ml-engine/
├── README.md                   This file
├── requirements.txt            Python dependencies
├── .env.example               Environment template
│
├── src/
│   ├── data/                  Data pipeline
│   ├── models/                ML models
│   ├── config/                Configuration
│   ├── api/                   FastAPI service (Phase 3)
│   └── utils/                 Utilities
│
├── notebooks/                 Jupyter notebooks
│   ├── 01_data_exploration.ipynb
│   ├── 02_feature_analysis.ipynb
│   └── 03_model_training.ipynb
│
├── tests/                     Unit tests
│
├── models/artifacts/          Trained model storage
│
└── data/
    ├── raw/                   Raw data exports
    ├── processed/             Preprocessed data
    └── splits/                Train/val/test splits
```

## Documentation

**Start Here:**
1. Read `../ML_ENGINE_OVERVIEW.md` (overview)
2. Read `../ML_ENGINE_DESIGN.md` (architecture)
3. Read `../docs/ML_PHASE_1_SETUP.md` (current phase)

## Phases

- **Phase 1:** Data exploration & baseline models (Weeks 1-2)
- **Phase 2:** Model training & tuning (Weeks 3-4)
- **Phase 3:** API service development (Weeks 5-6)
- **Phase 4:** Backend integration (Weeks 7-8)
- **Phase 5:** Frontend integration (Weeks 9-10)
- **Phase 6:** Monitoring & optimization (Weeks 11-12)

## Next Steps

1. Set up environment (see Quick Start above)
2. Read documentation (start with ML_ENGINE_OVERVIEW.md)
3. Explore data with Phase 1 notebook
4. Follow Phase 1 tasks in ../docs/ML_PHASE_1_SETUP.md

---

**Status:** Phase 1 - Foundation Setup
**Last Updated:** November 24, 2024
