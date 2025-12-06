# GuardQuote ML Pricing Engine - Design Document

## Executive Summary

This document outlines the architecture, design, and multi-phase implementation plan for the **Smart Quote Risk Assessment & Pricing ML Engine** for GuardQuote.

## Business Goals

1. **Automated Quote Generation** - Reduce manual pricing review time by 60%
2. **Competitive Accuracy** - Predict insurance premiums within ±15% margin
3. **Risk Mitigation** - Identify under/over-priced quotes automatically
4. **Customer Experience** - Provide instant quote estimates
5. **Revenue Optimization** - Optimize premium pricing across segments

## Multi-Phase Implementation Plan

### Phase 1: Foundation & Setup (Weeks 1-2)
- Data exploration and analysis
- Feature engineering framework
- Baseline models
- Documentation

### Phase 2: Model Development (Weeks 3-4)
- Train XGBoost model
- Hyperparameter tuning
- Feature importance analysis

### Phase 3: API Service Development (Weeks 5-6)
- FastAPI service
- Prediction endpoints
- Docker containerization

### Phase 4: Backend Integration (Weeks 7-8)
- NestJS endpoint integration
- Database tables for predictions
- Integration tests

### Phase 5: Frontend Integration (Weeks 9-10)
- Price prediction component
- Confidence indicator
- Real-time updates

### Phase 6: Monitoring & Optimization (Weeks 11-12)
- Performance monitoring
- Model drift detection
- Retraining pipeline

## ML Model Design

**Primary Model:** XGBoost Regressor
- Handles mixed data types
- Fast inference (< 50ms)
- Strong performance on tabular data
- Built-in feature importance

**Fallback Model:** Random Forest Regressor
- Interpretable
- Robust to outliers
- Parallel prediction

## Features

User Profile Features:
- Age, gender, occupation
- User type (individual/business)
- Health info (smoking, conditions)
- Employment status
- Company name, industry, revenue, employees

Quote Features:
- Quote type (individual/business)
- Coverage type (life, health, property, liability, disability)
- Coverage level (basic, standard, premium)
- Coverage amount, deductible
- Location (state, zip code)

## Target Variable

**estimated_amount** (insurance premium in dollars)

## Architecture Overview

```
Frontend (React)
    ↓
Backend API (NestJS)
    ↓
ML Service (Python/FastAPI)
    ↓
PostgreSQL Database
```

## Success Metrics

| Metric | Target |
|--------|--------|
| Prediction MAE | < 15% |
| Model R² Score | > 0.75 |
| Inference Latency | < 200ms |
| Service Availability | 99.9% |

## Next Steps

1. Review this design document
2. Begin Phase 1 setup (see ML_PHASE_1_SETUP.md)
3. Explore historical quote data
4. Build feature engineering pipeline

---

**Status:** Ready for Phase 1
**Last Updated:** November 24, 2024
