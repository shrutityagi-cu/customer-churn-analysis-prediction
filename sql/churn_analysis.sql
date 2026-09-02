-- ============================================================
-- CUSTOMER CHURN ANALYSIS
-- SQL BUSINESS ANALYSIS
-- ============================================================


-- 1. TOTAL NUMBER OF CUSTOMERS
-- ------------------------------------------------------------

SELECT
    COUNT(*) AS total_customers
FROM customers;


-- 2. OVERALL CHURN RATE
-- ------------------------------------------------------------

SELECT
    Churn,
    COUNT(*) AS customer_count,
    ROUND(
        100.0 * COUNT(*) / (SELECT COUNT(*) FROM customers),
        2
    ) AS percentage
FROM customers
GROUP BY Churn;


-- 3. CHURN BY CONTRACT TYPE
-- ------------------------------------------------------------

SELECT
    Contract,
    COUNT(*) AS total_customers,

    SUM(
        CASE
            WHEN Churn = 'Yes' THEN 1
            ELSE 0
        END
    ) AS churned_customers,

    ROUND(
        100.0 *
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END)
        / COUNT(*),
        2
    ) AS churn_rate

FROM customers

GROUP BY Contract
ORDER BY churn_rate DESC;


-- 4. CHURN BY TENURE GROUP
-- ------------------------------------------------------------

SELECT
    CASE
        WHEN tenure <= 12 THEN '0-12 months'
        WHEN tenure <= 24 THEN '13-24 months'
        WHEN tenure <= 48 THEN '25-48 months'
        ELSE '49+ months'
    END AS tenure_group,

    COUNT(*) AS total_customers,

    SUM(
        CASE
            WHEN Churn = 'Yes' THEN 1
            ELSE 0
        END
    ) AS churned_customers,

    ROUND(
        100.0 *
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END)
        / COUNT(*),
        2
    ) AS churn_rate

FROM customers

GROUP BY tenure_group
ORDER BY churn_rate DESC;


-- 5. CHURN BY INTERNET SERVICE
-- ------------------------------------------------------------

SELECT
    InternetService,
    COUNT(*) AS total_customers,

    SUM(
        CASE
            WHEN Churn = 'Yes' THEN 1
            ELSE 0
        END
    ) AS churned_customers,

    ROUND(
        100.0 *
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END)
        / COUNT(*),
        2
    ) AS churn_rate

FROM customers

GROUP BY InternetService
ORDER BY churn_rate DESC;


-- 6. CHURN BY PAYMENT METHOD
-- ------------------------------------------------------------

SELECT
    PaymentMethod,
    COUNT(*) AS total_customers,

    SUM(
        CASE
            WHEN Churn = 'Yes' THEN 1
            ELSE 0
        END
    ) AS churned_customers,

    ROUND(
        100.0 *
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END)
        / COUNT(*),
        2
    ) AS churn_rate

FROM customers

GROUP BY PaymentMethod
ORDER BY churn_rate DESC;


-- 7. CHURN BY GENDER
-- ------------------------------------------------------------

SELECT
    gender,
    COUNT(*) AS total_customers,

    SUM(
        CASE
            WHEN Churn = 'Yes' THEN 1
            ELSE 0
        END
    ) AS churned_customers,

    ROUND(
        100.0 *
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END)
        / COUNT(*),
        2
    ) AS churn_rate

FROM customers

GROUP BY gender
ORDER BY churn_rate DESC;


-- 8. CHURN BY SENIOR CITIZEN STATUS
-- ------------------------------------------------------------

SELECT
    CASE
        WHEN SeniorCitizen = 1 THEN 'Senior Citizen'
        ELSE 'Non-Senior Citizen'
    END AS customer_type,

    COUNT(*) AS total_customers,

    SUM(
        CASE
            WHEN Churn = 'Yes' THEN 1
            ELSE 0
        END
    ) AS churned_customers,

    ROUND(
        100.0 *
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END)
        / COUNT(*),
        2
    ) AS churn_rate

FROM customers

GROUP BY SeniorCitizen
ORDER BY churn_rate DESC;


-- 9. HIGH-VALUE CUSTOMERS
-- ------------------------------------------------------------

SELECT
    COUNT(*) AS high_value_customers,

    SUM(
        CASE
            WHEN Churn = 'Yes' THEN 1
            ELSE 0
        END
    ) AS churned_customers,

    ROUND(
        100.0 *
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END)
        / COUNT(*),
        2
    ) AS churn_rate

FROM customers

WHERE MonthlyCharges > 80;


-- 10. HIGH-RISK CUSTOMER SEGMENT
-- ------------------------------------------------------------

SELECT
    COUNT(*) AS high_risk_customers,

    SUM(
        CASE
            WHEN Churn = 'Yes' THEN 1
            ELSE 0
        END
    ) AS churned_customers,

    ROUND(
        100.0 *
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END)
        / COUNT(*),
        2
    ) AS churn_rate

FROM customers

WHERE Contract = 'Month-to-month'
AND tenure <= 12
AND MonthlyCharges > 70;


-- 11. HIGH-RISK CUSTOMERS WHO HAVE NOT YET CHURNED
-- ------------------------------------------------------------

SELECT
    customerID,
    tenure,
    Contract,
    InternetService,
    MonthlyCharges,
    PaymentMethod

FROM customers

WHERE Churn = 'No'
AND Contract = 'Month-to-month'
AND tenure <= 12
AND MonthlyCharges > 70

ORDER BY MonthlyCharges DESC;


-- 12. CUSTOMER VALUE SEGMENTATION
-- ------------------------------------------------------------

SELECT
    CASE
        WHEN MonthlyCharges < 35 THEN 'Low Value'
        WHEN MonthlyCharges < 60 THEN 'Medium Value'
        WHEN MonthlyCharges < 90 THEN 'High Value'
        ELSE 'Very High Value'
    END AS customer_segment,

    COUNT(*) AS customers,

    SUM(
        CASE
            WHEN Churn = 'Yes' THEN 1
            ELSE 0
        END
    ) AS churned_customers,

    ROUND(
        100.0 *
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END)
        / COUNT(*),
        2
    ) AS churn_rate

FROM customers

GROUP BY customer_segment
ORDER BY churn_rate DESC;


-- 13. AVERAGE MONTHLY CHARGES BY CHURN
-- ------------------------------------------------------------

SELECT
    Churn,
    ROUND(AVG(MonthlyCharges), 2) AS average_monthly_charges
FROM customers
GROUP BY Churn;


-- 14. AVERAGE TENURE BY CHURN
-- ------------------------------------------------------------

SELECT
    Churn,
    ROUND(AVG(tenure), 2) AS average_tenure
FROM customers
GROUP BY Churn;


-- 15. AVERAGE TOTAL CHARGES BY CHURN
-- ------------------------------------------------------------

SELECT
    Churn,
    ROUND(AVG(TotalCharges), 2) AS average_total_charges
FROM customers
GROUP BY Churn;