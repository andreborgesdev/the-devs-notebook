# Machine Learning Fundamentals

## Overview

Machine Learning (ML) is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed. It involves algorithms that can identify patterns, make predictions, and improve performance through experience.

## Types of Machine Learning

### Supervised Learning

- **Definition**: Learning with labeled training data
- **Goal**: Predict outcomes for new, unseen data
- **Examples**: Email spam detection, image classification, stock price prediction

#### Classification

- Predicts discrete categories or classes
- **Algorithms**: Decision Trees, Random Forest, SVM, Naive Bayes, Neural Networks
- **Evaluation**: Accuracy, Precision, Recall, F1-Score, ROC-AUC

#### Regression

- Predicts continuous numerical values
- **Algorithms**: Linear Regression, Polynomial Regression, Ridge, Lasso
- **Evaluation**: MSE, RMSE, MAE, R-squared

### Unsupervised Learning

- **Definition**: Learning patterns from unlabeled data
- **Goal**: Discover hidden structures in data

#### Clustering

- Groups similar data points together
- **Algorithms**: K-Means, Hierarchical Clustering, DBSCAN
- **Applications**: Customer segmentation, gene analysis

#### Dimensionality Reduction

- Reduces number of features while preserving information
- **Algorithms**: PCA, t-SNE, UMAP, LDA
- **Applications**: Data visualization, feature engineering

#### Association Rules

- Finds relationships between different items
- **Algorithms**: Apriori, FP-Growth
- **Applications**: Market basket analysis, recommendation systems

### Reinforcement Learning

- **Definition**: Learning through interaction with environment
- **Goal**: Maximize cumulative reward through trial and error
- **Components**: Agent, Environment, Actions, States, Rewards
- **Algorithms**: Q-Learning, Policy Gradient, Actor-Critic
- **Applications**: Game playing, robotics, autonomous vehicles

## The Machine Learning Pipeline

### 1. Problem Definition

- Understand business requirements
- Define success metrics
- Determine ML problem type

### 2. Data Collection and Exploration

- Gather relevant datasets
- Exploratory Data Analysis (EDA)
- Understand data distributions
- Identify missing values and outliers

### 3. Data Preprocessing

- **Data Cleaning**: Handle missing values, outliers
- **Feature Engineering**: Create new features, transform existing ones
- **Data Transformation**: Scaling, normalization, encoding
- **Data Splitting**: Train/validation/test sets

### 4. Model Selection and Training

- Choose appropriate algorithms
- Cross-validation for model selection
- Hyperparameter tuning
- Train models on training data

### 5. Model Evaluation

- Evaluate on validation/test sets
- Compare different models
- Analyze errors and bias

### 6. Model Deployment and Monitoring

- Deploy to production environment
- Monitor performance over time
- Retrain as needed

## Core Algorithms

### Linear Models

#### Linear Regression

- Finds best linear relationship between features and target
- **Equation**: y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ
- **Assumptions**: Linearity, independence, homoscedasticity, normality

#### Logistic Regression

- Linear model for classification
- Uses sigmoid function for probability estimation
- **Equation**: p = 1 / (1 + e^(-z))

### Tree-Based Models

#### Decision Trees

- Recursive binary splitting
- Easy to interpret and visualize
- Prone to overfitting

#### Random Forest

- Ensemble of decision trees
- Reduces overfitting through bagging
- Feature importance estimation

#### Gradient Boosting

- Sequential ensemble method
- Corrects errors of previous models
- **Variants**: XGBoost, LightGBM, CatBoost

### Support Vector Machines (SVM)

- Finds optimal separating hyperplane
- Kernel trick for non-linear problems
- Effective in high-dimensional spaces

### Neural Networks

- Inspired by biological neurons
- **Components**: Layers, nodes, weights, activation functions
- **Types**: Feedforward, Convolutional (CNN), Recurrent (RNN)

### Naive Bayes

- Based on Bayes' theorem
- Assumes feature independence
- Effective for text classification

### K-Nearest Neighbors (KNN)

- Instance-based learning
- Classifies based on k nearest neighbors
- Lazy learning algorithm

## Model Evaluation and Validation

### Cross-Validation

- **K-Fold**: Split data into k folds
- **Stratified**: Maintains class distribution
- **Leave-One-Out**: Special case where k equals dataset size

### Classification Metrics

- **Accuracy**: (TP + TN) / (TP + TN + FP + FN)
- **Precision**: TP / (TP + FP)
- **Recall**: TP / (TP + FN)
- **F1-Score**: 2 × (Precision × Recall) / (Precision + Recall)
- **ROC-AUC**: Area under ROC curve

### Regression Metrics

- **MSE**: Mean Squared Error
- **RMSE**: Root Mean Squared Error
- **MAE**: Mean Absolute Error
- **R²**: Coefficient of determination

### Bias-Variance Tradeoff

- **Bias**: Error from oversimplified assumptions
- **Variance**: Error from sensitivity to small fluctuations
- **Overfitting**: High variance, low bias
- **Underfitting**: High bias, low variance

## Feature Engineering

### Feature Selection

- **Filter Methods**: Statistical tests, correlation
- **Wrapper Methods**: Forward/backward selection
- **Embedded Methods**: L1/L2 regularization

### Feature Transformation

- **Scaling**: Min-max, standardization, robust scaling
- **Encoding**: One-hot, label, target encoding
- **Binning**: Convert continuous to categorical
- **Polynomial Features**: Create interaction terms

### Handling Categorical Data

- One-hot encoding for nominal variables
- Ordinal encoding for ordered categories
- Target encoding for high cardinality

### Dealing with Missing Data

- **Deletion**: Remove missing observations
- **Imputation**: Fill with mean, median, mode
- **Advanced**: Multiple imputation, model-based imputation

## Deep Learning Basics

### Neural Network Architecture

- **Input Layer**: Receives features
- **Hidden Layers**: Process information
- **Output Layer**: Produces predictions
- **Activation Functions**: ReLU, Sigmoid, Tanh

### Training Neural Networks

- **Forward Propagation**: Compute predictions
- **Backpropagation**: Calculate gradients
- **Gradient Descent**: Update weights
- **Learning Rate**: Controls step size

### Deep Learning Types

- **Convolutional Neural Networks (CNN)**: Image processing
- **Recurrent Neural Networks (RNN)**: Sequential data
- **Long Short-Term Memory (LSTM)**: Long sequences
- **Transformer**: Attention mechanism

## Common Challenges

### Overfitting

- Model too complex for data
- **Solutions**: Regularization, early stopping, cross-validation

### Underfitting

- Model too simple
- **Solutions**: Increase complexity, add features

### Data Quality Issues

- Missing values, outliers, noise
- Inconsistent data collection
- Selection bias

### Curse of Dimensionality

- Performance degrades with too many features
- **Solutions**: Dimensionality reduction, feature selection

### Imbalanced Classes

- Unequal class distribution
- **Solutions**: Resampling, cost-sensitive learning, ensemble methods

## Model Interpretability

### Feature Importance

- Tree-based models provide natural importance
- Permutation importance for any model
- SHAP (SHapley Additive exPlanations)

### Model-Agnostic Methods

- **LIME**: Local explanations
- **SHAP**: Global and local explanations
- **Partial Dependence Plots**: Feature effect visualization

### Interpretable Models

- Linear models with meaningful coefficients
- Decision trees with clear rules
- Rule-based systems

## ML in Production

### Model Deployment

- **Batch Prediction**: Offline processing
- **Real-time Prediction**: Online serving
- **Edge Deployment**: On-device inference

### MLOps Practices

- Version control for data and models
- Automated testing and validation
- Continuous integration/deployment
- Model monitoring and retraining

### Scalability Considerations

- Distributed training
- Model compression
- Hardware acceleration (GPU, TPU)

## Ethics and Fairness

### Algorithmic Bias

- Historical bias in training data
- Representation bias
- Evaluation bias

### Fairness Metrics

- Demographic parity
- Equal opportunity
- Counterfactual fairness

### Responsible AI

- Transparency and explainability
- Privacy preservation
- Human oversight

## Interview Topics

### Fundamental Concepts

- Explain bias-variance tradeoff
- Compare supervised vs unsupervised learning
- Describe overfitting and solutions
- Discuss cross-validation importance

### Algorithm Specifics

- How does random forest work?
- Explain gradient descent
- Compare SVM kernels
- Describe neural network training

### Practical Applications

- How to handle imbalanced datasets?
- Feature selection strategies
- Model evaluation in production
- A/B testing for ML models

## Best Practices

### Data Management

- Version control datasets
- Document data lineage
- Ensure data quality
- Protect sensitive information

### Model Development

- Start with simple baselines
- Use appropriate evaluation metrics
- Validate assumptions
- Consider computational constraints

### Production Deployment

- Monitor model performance
- Plan for model updates
- Handle edge cases gracefully
- Maintain model documentation

### Continuous Learning

- Stay updated with latest research
- Participate in competitions
- Build diverse project portfolio
- Understand business context
