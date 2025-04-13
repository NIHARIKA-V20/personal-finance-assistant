import streamlit as st
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

st.set_page_config(page_title="Personal Finance Assistant", layout="centered")
st.title("Personal Finance Assistant")

st.markdown("""
A smart assistant that helps you track expenses, analyze behavior, and suggest saving habits using ML.
""")

# Upload Expense CSV
st.subheader("1. Upload Your Expense CSV")
uploaded_file = st.file_uploader("Upload CSV", type="csv")

if uploaded_file:
    df = pd.read_csv(uploaded_file)
    st.write("### Uploaded Data Preview")
    st.dataframe(df.head())

    # Basic category analysis
    st.subheader("2. Spending by Category")
    if 'Category' in df.columns and 'Amount' in df.columns:
        category_expense = df.groupby("Category")["Amount"].sum().sort_values(ascending=False)
        st.bar_chart(category_expense)

        # Clustering user behavior
        st.subheader("3. ML-Based Behavior Clustering")
        kmeans = KMeans(n_clusters=3, random_state=42)
        df['Cluster'] = kmeans.fit_predict(df[['Amount']])
        st.dataframe(df[['Category', 'Amount', 'Cluster']])

        st.subheader("4. Insights")
        avg_spend = df["Amount"].mean()
        if avg_spend > 1000:
            st.info("You're spending above average. Focus on reducing unnecessary expenses.")
        else:
            st.success("Good job! Your average spending is under control.")

    else:
        st.error("CSV must contain 'Category' and 'Amount' columns.")
