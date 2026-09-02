import streamlit as st
import pandas as pd
import joblib


# --------------------------------------------------
# PAGE CONFIGURATION
# --------------------------------------------------

st.set_page_config(
    page_title="Customer Churn Prediction",
    layout="wide"
)


# --------------------------------------------------
# LOAD MODEL
# --------------------------------------------------

@st.cache_resource
def load_model():
    return joblib.load("models/churn_model.pkl")


model = load_model()
@st.cache_data
def load_data():
    return pd.read_csv("data/cleaned_churn_data.csv")


df = load_data()

# --------------------------------------------------
# TITLE
# --------------------------------------------------

st.title("Customer Churn Prediction")
st.markdown(
    "Predict whether a customer is likely to **churn** based on "
    "their demographic, service, contract, and billing information."
)

st.divider()


# --------------------------------------------------
# CUSTOMER INFORMATION
# --------------------------------------------------

st.header("Customer Information")

col1, col2, col3 = st.columns(3)

with col1:
    gender = st.selectbox(
        "Gender",
        ["Male", "Female"]
    )

    senior_citizen = st.selectbox(
        "Senior Citizen",
        [0, 1],
        format_func=lambda x: "Yes" if x == 1 else "No"
    )

    partner = st.selectbox(
        "Partner",
        ["Yes", "No"]
    )

with col2:
    dependents = st.selectbox(
        "Dependents",
        ["Yes", "No"]
    )

    tenure = st.number_input(
        "Tenure (months)",
        min_value=0,
        max_value=72,
        value=12
    )

    phone_service = st.selectbox(
        "Phone Service",
        ["Yes", "No"]
    )

with col3:
    multiple_lines = st.selectbox(
        "Multiple Lines",
        ["Yes", "No", "No phone service"]
    )

    internet_service = st.selectbox(
        "Internet Service",
        ["DSL", "Fiber optic", "No"]
    )


# --------------------------------------------------
# SERVICES
# --------------------------------------------------

st.header("Services")

col1, col2, col3 = st.columns(3)

with col1:
    online_security = st.selectbox(
        "Online Security",
        ["Yes", "No", "No internet service"]
    )

    online_backup = st.selectbox(
        "Online Backup",
        ["Yes", "No", "No internet service"]
    )

with col2:
    device_protection = st.selectbox(
        "Device Protection",
        ["Yes", "No", "No internet service"]
    )

    tech_support = st.selectbox(
        "Tech Support",
        ["Yes", "No", "No internet service"]
    )

with col3:
    streaming_tv = st.selectbox(
        "Streaming TV",
        ["Yes", "No", "No internet service"]
    )

    streaming_movies = st.selectbox(
        "Streaming Movies",
        ["Yes", "No", "No internet service"]
    )


# --------------------------------------------------
# CONTRACT & BILLING
# --------------------------------------------------

st.header("Contract & Billing")

col1, col2, col3 = st.columns(3)

with col1:
    contract = st.selectbox(
        "Contract",
        [
            "Month-to-month",
            "One year",
            "Two year"
        ]
    )

with col2:
    paperless_billing = st.selectbox(
        "Paperless Billing",
        ["Yes", "No"]
    )

with col3:
    payment_method = st.selectbox(
        "Payment Method",
        [
            "Electronic check",
            "Mailed check",
            "Bank transfer (automatic)",
            "Credit card (automatic)"
        ]
    )


# --------------------------------------------------
# CHARGES
# --------------------------------------------------

col1, col2 = st.columns(2)

with col1:
    monthly_charges = st.number_input(
        "Monthly Charges ($)",
        min_value=0.0,
        max_value=200.0,
        value=70.0,
        step=1.0
    )

with col2:
    total_charges = st.number_input(
        "Total Charges ($)",
        min_value=0.0,
        max_value=10000.0,
        value=840.0,
        step=10.0
    )


st.divider()


# --------------------------------------------------
# PREDICTION
# --------------------------------------------------

if st.button(
    "Predict Customer Churn",
    use_container_width=True
):

    customer_data = pd.DataFrame({
        "gender": [gender],
        "SeniorCitizen": [senior_citizen],
        "Partner": [partner],
        "Dependents": [dependents],
        "tenure": [tenure],
        "PhoneService": [phone_service],
        "MultipleLines": [multiple_lines],
        "InternetService": [internet_service],
        "OnlineSecurity": [online_security],
        "OnlineBackup": [online_backup],
        "DeviceProtection": [device_protection],
        "TechSupport": [tech_support],
        "StreamingTV": [streaming_tv],
        "StreamingMovies": [streaming_movies],
        "Contract": [contract],
        "PaperlessBilling": [paperless_billing],
        "PaymentMethod": [payment_method],
        "MonthlyCharges": [monthly_charges],
        "TotalCharges": [total_charges]
    })


    # Prediction
    prediction = model.predict(customer_data)[0]

    probability = model.predict_proba(customer_data)[0][1]

    churn_probability = probability * 100


    # --------------------------------------------------
    # DISPLAY RESULT
    # --------------------------------------------------

    st.subheader("Prediction Result")

    if prediction == 1:

        st.error(
            f"Customer is likely to churn\n\n"
            f"Estimated churn probability: **{churn_probability:.2f}%**"
        )

        if churn_probability >= 70:
            risk_level = "High Risk"
        else:
            risk_level = "Medium Risk"

    else:

        st.success(
            f"Customer is likely to stay\n\n"
            f"Estimated churn probability: **{churn_probability:.2f}%**"
        )

        risk_level = "Low Risk"


    st.metric(
        "Churn Probability",
        f"{churn_probability:.2f}%"
    )

    st.metric(
        "Risk Level",
        risk_level
    )


    # --------------------------------------------------
    # BUSINESS RECOMMENDATION
    # --------------------------------------------------

    st.subheader("Recommended Action")

    if churn_probability >= 70:

        st.warning(
            "This customer has a high predicted churn probability. "
            "Consider proactive retention measures such as personalized "
            "offers, discounts, service improvements, or contract upgrades."
        )

    elif churn_probability >= 40:

        st.info(
            "This customer has a moderate churn probability. "
            "Consider monitoring the customer and providing targeted "
            "engagement or retention offers."
        )

    else:

        st.success(
            "This customer currently has a relatively low churn probability. "
            "Continue regular customer engagement and service monitoring."
        )

        # ==================================================
# ANALYTICS DASHBOARD
# ==================================================

st.divider()

st.header("Customer Churn Analytics Dashboard")

st.markdown(
    "Explore customer characteristics and identify patterns "
    "associated with customer churn."
)


# --------------------------------------------------
# KEY METRICS
# --------------------------------------------------

total_customers = len(df)

total_churned = df["ChurnFlag"].sum()

churn_rate = (total_churned / total_customers) * 100

average_monthly_charges = df["MonthlyCharges"].mean()

average_tenure = df["tenure"].mean()


col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(
        "Total Customers",
        f"{total_customers:,}"
    )

with col2:
    st.metric(
        "Customers Churned",
        f"{int(total_churned):,}"
    )

with col3:
    st.metric(
        "Overall Churn Rate",
        f"{churn_rate:.2f}%"
    )

with col4:
    st.metric(
        "Avg. Monthly Charges",
        f"${average_monthly_charges:.2f}"
    )


# --------------------------------------------------
# CHURN DISTRIBUTION
# --------------------------------------------------

st.subheader("Churn Distribution")

churn_distribution = (
    df["Churn"]
    .value_counts()
    .rename_axis("Churn Status")
    .to_frame("Customers")
)

st.bar_chart(churn_distribution)


# --------------------------------------------------
# CHURN BY CONTRACT
# --------------------------------------------------

st.subheader("Churn Rate by Contract Type")

contract_churn = (
    df.groupby("Contract")["ChurnFlag"]
    .mean()
    .mul(100)
    .sort_values(ascending=False)
    .to_frame("Churn Rate (%)")
)

st.bar_chart(contract_churn)


# --------------------------------------------------
# CHURN BY PAYMENT METHOD
# --------------------------------------------------

st.subheader("Churn Rate by Payment Method")

payment_churn = (
    df.groupby("PaymentMethod")["ChurnFlag"]
    .mean()
    .mul(100)
    .sort_values(ascending=False)
    .to_frame("Churn Rate (%)")
)

st.bar_chart(payment_churn)


# --------------------------------------------------
# CHURN BY INTERNET SERVICE
# --------------------------------------------------

st.subheader("Churn Rate by Internet Service")

internet_churn = (
    df.groupby("InternetService")["ChurnFlag"]
    .mean()
    .mul(100)
    .sort_values(ascending=False)
    .to_frame("Churn Rate (%)")
)

st.bar_chart(internet_churn)


# --------------------------------------------------
# TENURE ANALYSIS
# --------------------------------------------------

st.subheader("Average Tenure by Churn Status")

tenure_churn = (
    df.groupby("Churn")["tenure"]
    .mean()
    .to_frame("Average Tenure")
)

st.bar_chart(tenure_churn)


# --------------------------------------------------
# MONTHLY CHARGES ANALYSIS
# --------------------------------------------------

st.subheader("Average Monthly Charges by Churn Status")

charges_churn = (
    df.groupby("Churn")["MonthlyCharges"]
    .mean()
    .to_frame("Average Monthly Charges")
)

st.bar_chart(charges_churn)


# --------------------------------------------------
# HIGH-RISK CUSTOMERS
# --------------------------------------------------

st.subheader("High-Risk Customer Segment")

high_risk = df[
    (df["Contract"] == "Month-to-month") &
    (df["tenure"] <= 12) &
    (df["MonthlyCharges"] > 70)
]

col1, col2 = st.columns(2)

with col1:
    st.metric(
        "High-Risk Customers",
        f"{len(high_risk):,}"
    )

with col2:
    high_risk_percentage = (
        len(high_risk) / len(df)
    ) * 100

    st.metric(
        "Share of Customer Base",
        f"{high_risk_percentage:.2f}%"
    )


st.dataframe(
    high_risk[
        [
            "customerID",
            "Contract",
            "tenure",
            "MonthlyCharges",
            "InternetService",
            "PaymentMethod",
            "Churn"
        ]
    ].head(20),
    use_container_width=True
)