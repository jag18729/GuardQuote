# GuardQuote ML Pricing Engine - Project Overview

**Status:** Documentation Complete - Ready for Phase 1 Implementation
**Last Updated:** November 24, 2024

## What is This?

The **ML Pricing Engine** automatically predicts insurance premium amounts based on customer profiles and coverage requirements.

**Example:**
```
Input: 35-year-old, non-smoker, life insurance, standard coverage
Output: Estimated Premium: $1,250/year (87% confidence)
```

## Why Build This?

### Business Benefits
- Faster quotes (instant vs 2-3 days)
- Reduced costs (60% less manual review)
- Better accuracy (learns from data)
- Competitive advantage
- Revenue optimization

### Technical Benefits
- Automate repetitive decisions
- Create reusable ML infrastructure
- Enable A/B testing
- Establish feedback loop for continuous improvement

## How It Works

```
1. Customer submits quote request
2. Backend collects data (age, coverage type, etc.)
3. ML Service predicts price
4. Frontend displays prediction with confidence
5. Customer completes quote
6. Actual premium recorded for model improvement
```

## Multi-Phase Plan

| Phase | Duration | Focus | Owner |
|-------|----------|-------|-------|
| 1 | Weeks 1-2 | Data exploration, features, baselines | ML |
| 2 | Weeks 3-4 | Model training, tuning, evaluation | ML |
| 3 | Weeks 5-6 | FastAPI service, Docker | ML/DevOps |
| 4 | Weeks 7-8 | Backend integration, database | Backend |
| 5 | Weeks 9-10 | Frontend UI, real-time updates | Frontend |
| 6 | Weeks 11-12 | Monitoring, drift detection, retraining | All |

## Key Concepts

### Features
Input variables describing a quote (age, coverage_type, income, etc.)

### Target Variable
What we predict: estimated_amount (insurance premium)

### Training vs Prediction
- **Training:** Learn patterns from 500+ historical quotes
- **Prediction:** Apply learned patterns to new quotes

### Model Types
- **XGBoost** (primary): Fast, accurate, handles all feature types
- **Random Forest** (backup): Interpretable, robust fallback

## Project Structure

```
ml-engine/
├── README.md                 Start here for setup
├── requirements.txt          Python dependencies
├── src/
│   ├── data/                Data pipeline
│   ├── models/              ML implementations
│   ├── config/              Configuration
│   └── api/                 FastAPI service (Phase 3)
├── notebooks/               Jupyter for exploration
├── tests/                   Unit tests
├── models/artifacts/        Trained models
└── docs/
    ├── DATA_SCHEMA.md       Feature definitions
    ├── FEATURE_ENGINEERING.md  Feature pipeline
    └── TRAINING_GUIDE.md    Training procedures
```

## Getting Started

### For Everyone
1. Read this overview (current file)
2. Read ML_ENGINE_DESIGN.md for architecture
3. Read docs/ML_PHASE_1_SETUP.md for current tasks

### For ML Engineers
1. Set up environment: `cd ml-engine && python -m venv venv && pip install -r requirements.txt`
2. Explore data: `jupyter notebook notebooks/01_data_exploration.ipynb`
3. Follow Phase 1 tasks in `docs/ML_PHASE_1_SETUP.md`

### For Backend Engineers
1. Understand API contract (input/output format)
2. Plan NestJS integration (new endpoint, database)
3. Wait for Phase 3 completion, then integrate

### For Frontend Engineers
1. Understand prediction display requirements
2. Plan UI components (price, confidence, factors)
3. Wait for Phase 4 completion, then integrate

## Success Metrics

- **Phase 1:** Data explored, features identified, baselines trained
- **Phase 2:** XGBoost trained with MAE < 18%
- **Phase 3:** API service running with < 200ms latency
- **Phase 4:** Backend integration complete with tests passing
- **Phase 5:** Frontend shows predictions with confidence
- **Phase 6:** Production accuracy MAE < 15%

## Next Steps

1. **Read:** ML_ENGINE_DESIGN.md (detailed architecture)
2. **Read:** docs/ML_PHASE_1_SETUP.md (current tasks)
3. **Setup:** ml-engine environment
4. **Start:** Phase 1 data exploration

## Questions?

Check the documentation:
- Architecture: ML_ENGINE_DESIGN.md
- Current tasks: docs/ML_PHASE_1_SETUP.md
- Setup help: ml-engine/README.md
- Code examples: ml-engine/notebooks/

---

**Version:** 1.0.0
**Created:** November 24, 2024
