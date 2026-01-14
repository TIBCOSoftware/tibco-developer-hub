# Pongo2 Template Examples

This document provides practical examples of pongo2 templates with sample variable values and their expected outputs. Use these examples to understand pongo2 syntax and test the activity.

## Table of Contents

1. [Basic Variable Substitution](#basic-variable-substitution)
2. [Conditional Logic](#conditional-logic)
3. [Loops and Iterations](#loops-and-iterations)
4. [Filters and Formatting](#filters-and-formatting)
5. [AI Prompt Templates](#ai-prompt-templates)
6. [Data Analysis Templates](#data-analysis-templates)
7. [Complex Nested Structures](#complex-nested-structures)
8. [Business Document Templates](#business-document-templates)
9. [Travel Itinerary Generator](#travel-itinerary-generator)

---

## Basic Variable Substitution

### Example 1: Simple Greeting

**Template:**
```pongo2
Hello {{ name }}! Welcome to {{ company }}.
Your role is {{ role }} 
{% if experience == 0 %} and welcome to your first professional role!
{% elif experience > 0 %} and well done on your {{ experience }} years of experience!{% endif %}
{% if experience == 10 or experience == 15 or experience == 20 %} We truly appreciate your significant contribution to the industry.{% endif %}
```
*JSON Schema*
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "company": {
            "type": "string"
        },
        "role": {
            "type": "string"
        },
        "experience": {
            "type": "number"
        }
    }
}
**Sample Variables (New Employee):**
```json
{
  "name": "John Smith",
  "company": "TechCorp Solutions",
  "role": "Junior Developer",
  "experience": 0
}
```

**Expected Output (New Employee):**
```
Hello John Smith! Welcome to TechCorp Solutions.
Your role is Junior Developer and welcome to your first professional role!
```

**Sample Variables (Experienced Employee):**
```json
{
  "name": "Alice Johnson",
  "company": "TechCorp Solutions",
  "role": "Senior Developer",
  "experience": 8
}
```

**Expected Output (Experienced Employee):**
```
Hello Alice Johnson! Welcome to TechCorp Solutions.
Your role is Senior Developer and well done on your 8 years of experience!
```

**Sample Variables (Milestone Experience):**
```json
{
  "name": "Robert Chen",
  "company": "TechCorp Solutions",
  "role": "Principal Architect",
  "experience": 15
}
```

**Expected Output (Milestone Experience):**
```
Hello Robert Chen! Welcome to TechCorp Solutions.
Your role is Principal Architect and well done on your 15 years of experience! We truly appreciate your significant contribution to the industry.
```

### Example 2: Product Information

**Template:**
```pongo2
Product: {{ product_name }}
Price: ${{ price }}
Category: {{ category }}
In Stock: {{ stock_quantity }} units
Description: {{ description }}
```

**Sample Variables:**
```json
{
  "product_name": "Wireless Bluetooth Headphones",
  "price": 89.99,
  "category": "Electronics",
  "stock_quantity": 45,
  "description": "High-quality wireless headphones with noise cancellation"
}
```

**Expected Output:**
```
Product: Wireless Bluetooth Headphones
Price: $89.99
Category: Electronics
In Stock: 45 units
Description: High-quality wireless headphones with noise cancellation
```

---

## Conditional Logic

### Example 3: User Access Level

**Template:**
```pongo2
{% if user_type == "admin" %}
🔒 **ADMINISTRATOR ACCESS**
You have full system privileges including:
- User management
- System configuration
- Data access and modification
{% elif user_type == "manager" %}
📊 **MANAGER ACCESS**
You have management privileges including:
- Team oversight
- Report generation
- Limited configuration access
{% else %}
👤 **STANDARD USER ACCESS**
You have standard privileges including:
- Data viewing
- Basic operations
- Personal settings
{% endif %}

Account Status: {% if is_active %}Active{% else %}Inactive{% endif %}
```

**Sample Variables (Admin):**
```json
{
  "user_type": "admin",
  "is_active": true
}
```

**Expected Output (Admin):**
```
🔒 **ADMINISTRATOR ACCESS**
You have full system privileges including:
- User management
- System configuration
- Data access and modification

Account Status: Active
```

**Sample Variables (Standard User):**
```json
{
  "user_type": "user",
  "is_active": false
}
```

**Expected Output (Standard User):**
```
👤 **STANDARD USER ACCESS**
You have standard privileges including:
- Data viewing
- Basic operations
- Personal settings

Account Status: Inactive
```

---

## Loops and Iterations

### Example 4: Task List

**Template:**
```pongo2
📋 **Project Tasks for {{ project_name }}**

{% for task in tasks %}
{{ forloop.Counter }}. **{{ task.title }}**{% if task.priority == "high" %} 🔴 HIGH PRIORITY{% elif task.priority == "medium" %} 🟡 MEDIUM{% else %} 🟢 LOW{% endif %}
   - Status: {{ task.status }}
   - Assigned to: {{ task.assignee }}
   - Due: {{ task.due_date }}
{% endfor %}

Total Tasks: {{ tasks|length }}
```

**Sample Variables:**
```json
{
  "project_name": "Website Redesign",
  "tasks": [
    {
      "title": "Create wireframes",
      "priority": "high",
      "status": "In Progress",
      "assignee": "Sarah Chen",
      "due_date": "2025-09-20"
    },
    {
      "title": "Design homepage mockup",
      "priority": "medium",
      "status": "Not Started",
      "assignee": "Mike Rodriguez",
      "due_date": "2025-09-25"
    },
    {
      "title": "Update footer content",
      "priority": "low",
      "status": "Completed",
      "assignee": "Lisa Wang",
      "due_date": "2025-09-15"
    }
  ]
}
```

**Expected Output:**
```
📋 **Project Tasks for Website Redesign**

1. **Create wireframes** 🔴 HIGH PRIORITY
   - Status: In Progress
   - Assigned to: Sarah Chen
   - Due: 2025-09-20
2. **Design homepage mockup** 🟡 MEDIUM
   - Status: Not Started
   - Assigned to: Mike Rodriguez
   - Due: 2025-09-25
3. **Update footer content** 🟢 LOW
   - Status: Completed
   - Assigned to: Lisa Wang
   - Due: 2025-09-15

Total Tasks: 3
```

---

## Filters and Formatting

### Example 5: Text Formatting

**Template:**
```pongo2
**User Profile**

Name: {{ full_name|title }}
Username: {{ username|lower }}
Email: {{ email|lower }}
Bio: {{ bio|truncatewords:10 }}
Member Since: {{ join_date }}
Last Login: {{ last_login|default:"Never" }}

**Statistics:**
- Posts: {{ post_count|default:0 }}
- Followers: {{ follower_count|default:0 }}
- Following: {{ following_count|default:0 }}

**Settings:**
- Profile Visibility: {{ is_public|yesno:"Public,Private" }}
- Email Notifications: {{ email_notifications|yesno:"Enabled,Disabled" }}
```

**Sample Variables:**
```json
{
  "full_name": "john DOE",
  "username": "JohnD123",
  "email": "JOHN.DOE@EXAMPLE.COM",
  "bio": "Software developer passionate about creating innovative solutions for complex problems and mentoring junior developers in the tech industry",
  "join_date": "2023-03-15",
  "last_login": "2025-09-14",
  "post_count": 42,
  "follower_count": 156,
  "following_count": 89,
  "is_public": true,
  "email_notifications": false
}
```

**Expected Output:**
```
**User Profile**

Name: John Doe
Username: johnd123
Email: john.doe@example.com
Bio: Software developer passionate about creating innovative solutions for complex
Member Since: 2023-03-15
Last Login: 2025-09-14

**Statistics:**
- Posts: 42
- Followers: 156
- Following: 89

**Settings:**
- Profile Visibility: Public
- Email Notifications: Disabled
```

---

## AI Prompt Templates

### Example 6: Code Review Assistant

**Template:**
```pongo2
You are an expert {{ programming_language }} developer performing a code review.

**Review Context:**
- Repository: {{ repository_name }}
- Branch: {{ branch_name }}
- Author: {{ author }}
- Files Changed: {{ files_changed }}

**Code to Review:**
```{{ language_extension }}
{{ code_snippet }}
```

**Review Focus Areas:**
{% for area in focus_areas %}
- {{ area }}
{% endfor %}

**Instructions:**
1. Analyze the code for {{ review_type }} issues
2. Check for best practices and {{ programming_language }} conventions
3. Suggest improvements for performance and maintainability
4. Rate the code quality from 1-10
5. Provide specific, actionable feedback

Please provide your detailed code review.
```

**Sample Variables:**
```json
{
  "programming_language": "Python",
  "repository_name": "data-analytics-platform",
  "branch_name": "feature/user-authentication",
  "author": "Alice Chen",
  "files_changed": 3,
  "language_extension": "python",
  "code_snippet": "def authenticate_user(username, password):\n    if not username or not password:\n        return False\n    user = db.get_user(username)\n    if user and user.password == password:\n        return True\n    return False",
  "focus_areas": ["Security vulnerabilities", "Error handling", "Code structure", "Performance"],
  "review_type": "security and functionality"
}
```

**Expected Output:**
```
You are an expert Python developer performing a code review.

**Review Context:**
- Repository: data-analytics-platform
- Branch: feature/user-authentication
- Author: Alice Chen
- Files Changed: 3

**Code to Review:**
```python
def authenticate_user(username, password):
    if not username or not password:
        return False
    user = db.get_user(username)
    if user and user.password == password:
        return True
    return False
```

**Review Focus Areas:**
- Security vulnerabilities
- Error handling
- Code structure
- Performance

**Instructions:**
1. Analyze the code for security and functionality issues
2. Check for best practices and Python conventions
3. Suggest improvements for performance and maintainability
4. Rate the code quality from 1-10
5. Provide specific, actionable feedback

Please provide your detailed code review.
```

---

## Data Analysis Templates

### Example 7: Dataset Analysis Report

**Template:**
```pongo2
# {{ dataset_name }} Analysis Report

**Dataset Overview:**
- **Source:** {{ data_source }}
- **Collection Period:** {{ start_date }} to {{ end_date }}
- **Total Records:** {{ total_records|floatformat:0 }}
- **Columns:** {{ column_count }}
- **Missing Data:** {{ missing_percentage|floatformat:1 }}%

## Key Variables

{% for variable in key_variables %}
### {{ variable.name|title }} ({{ variable.type }})
- **Description:** {{ variable.description }}
- **Range:** {{ variable.min_value }} - {{ variable.max_value }}
- **Missing Values:** {{ variable.missing_count|default:0 }}
{% if variable.unique_values %}
- **Unique Values:** {{ variable.unique_values }}
{% endif %}

{% endfor %}

## Analysis Objectives

**Primary Question:** {{ research_question }}

**Hypotheses:**
{% for hypothesis in hypotheses %}
**H{{ forloop.Counter }}:** {{ hypothesis.statement }}
- **Expected Result:** {{ hypothesis.expected_outcome }}
- **Test Method:** {{ hypothesis.test_method }}
{% endfor %}

## Methodology

{% for step in methodology_steps %}
{{ forloop.Counter }}. **{{ step.phase }}**
   - {{ step.description }}
   - Tools: {{ step.tools|join:", " }}
   - Duration: {{ step.estimated_days }} days
{% endfor %}

**Success Criteria:**
{% for criteria in success_criteria %}
- {{ criteria }}
{% endfor %}
```

**Sample Variables:**
```json
{
  "dataset_name": "E-commerce Customer Behavior",
  "data_source": "Web Analytics Platform",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "total_records": 1250000,
  "column_count": 18,
  "missing_percentage": 3.2,
  "key_variables": [
    {
      "name": "customer_lifetime_value",
      "type": "numeric",
      "description": "Total value of purchases made by customer",
      "min_value": "$0",
      "max_value": "$15,450",
      "missing_count": 1200
    },
    {
      "name": "purchase_frequency",
      "type": "numeric", 
      "description": "Number of purchases per month",
      "min_value": "0",
      "max_value": "45",
      "missing_count": 0
    },
    {
      "name": "customer_segment",
      "type": "categorical",
      "description": "Customer segmentation category",
      "min_value": "N/A",
      "max_value": "N/A",
      "missing_count": 0,
      "unique_values": "Premium, Standard, Basic"
    }
  ],
  "research_question": "What factors most significantly influence customer retention and lifetime value?",
  "hypotheses": [
    {
      "statement": "Customers with higher purchase frequency have significantly higher lifetime value",
      "expected_outcome": "Strong positive correlation (r > 0.7)",
      "test_method": "Pearson correlation analysis"
    },
    {
      "statement": "Premium segment customers have 3x higher retention rates than Basic segment",
      "expected_outcome": "Premium retention > 80%, Basic retention < 30%",
      "test_method": "Chi-square test of independence"
    }
  ],
  "methodology_steps": [
    {
      "phase": "Data Cleaning & Preparation",
      "description": "Handle missing values, outliers, and data type conversions",
      "tools": ["Python", "Pandas", "NumPy"],
      "estimated_days": 3
    },
    {
      "phase": "Exploratory Data Analysis",
      "description": "Generate descriptive statistics and visualizations",
      "tools": ["Matplotlib", "Seaborn", "Plotly"],
      "estimated_days": 2
    },
    {
      "phase": "Statistical Testing",
      "description": "Test hypotheses using appropriate statistical methods",
      "tools": ["SciPy", "Statsmodels"],
      "estimated_days": 2
    }
  ],
  "success_criteria": [
    "Achieve >95% confidence level in statistical tests",
    "Identify at least 3 significant predictive factors",
    "Create actionable recommendations for business team"
  ]
}
```

**Expected Output:**
```
# E-commerce Customer Behavior Analysis Report

**Dataset Overview:**
- **Source:** Web Analytics Platform
- **Collection Period:** 2024-01-01 to 2024-12-31
- **Total Records:** 1250000
- **Columns:** 18
- **Missing Data:** 3.2%

## Key Variables

### Customer_Lifetime_Value (numeric)
- **Description:** Total value of purchases made by customer
- **Range:** $0 - $15,450
- **Missing Values:** 1200

### Purchase_Frequency (numeric)
- **Description:** Number of purchases per month
- **Range:** 0 - 45
- **Missing Values:** 0

### Customer_Segment (categorical)
- **Description:** Customer segmentation category
- **Range:** N/A - N/A
- **Missing Values:** 0
- **Unique Values:** Premium, Standard, Basic

## Analysis Objectives

**Primary Question:** What factors most significantly influence customer retention and lifetime value?

**Hypotheses:**
**H1:** Customers with higher purchase frequency have significantly higher lifetime value
- **Expected Result:** Strong positive correlation (r > 0.7)
- **Test Method:** Pearson correlation analysis
**H2:** Premium segment customers have 3x higher retention rates than Basic segment
- **Expected Result:** Premium retention > 80%, Basic retention < 30%
- **Test Method:** Chi-square test of independence

## Methodology

1. **Data Cleaning & Preparation**
   - Handle missing values, outliers, and data type conversions
   - Tools: Python, Pandas, NumPy
   - Duration: 3 days
2. **Exploratory Data Analysis**
   - Generate descriptive statistics and visualizations
   - Tools: Matplotlib, Seaborn, Plotly
   - Duration: 2 days
3. **Statistical Testing**
   - Test hypotheses using appropriate statistical methods
   - Tools: SciPy, Statsmodels
   - Duration: 2 days

**Success Criteria:**
- Achieve >95% confidence level in statistical tests
- Identify at least 3 significant predictive factors
- Create actionable recommendations for business team
```

---

## Complex Nested Structures

### Example 8: Project Status Report

**Template:**
```pongo2
# {{ project.name }} - {{ quarter }} Status Report

**Project Information:**
- **Manager:** {{ project.manager.name }} ({{ project.manager.email }})
- **Start Date:** {{ project.start_date }}
- **Target Completion:** {{ project.target_date }}
- **Budget:** ${{ project.budget|floatformat:0 }}
- **Status:** {% if project.status == "on_track" %}🟢 On Track{% elif project.status == "at_risk" %}🟡 At Risk{% else %}🔴 Behind Schedule{% endif %}

## Team Members ({{ project.team|length }})

{% for member in project.team %}
**{{ member.name }}** - {{ member.role }}
- Email: {{ member.email }}
- Utilization: {{ member.utilization }}%
- Skills: {{ member.skills|join:", " }}
{% endfor %}

## Milestones Progress

{% for milestone in project.milestones %}
### {{ milestone.name }}
- **Target:** {{ milestone.target_date }}
- **Status:** {% if milestone.completed %}✅ Completed ({{ milestone.completion_date }}){% elif milestone.in_progress %}🔄 In Progress{% else %}⏳ Not Started{% endif %}
{% if milestone.deliverables %}
- **Deliverables:**
{% for deliverable in milestone.deliverables %}
  - {{ deliverable.name }} ({{ deliverable.status }})
{% endfor %}
{% endif %}
{% endfor %}

## Risk Assessment

{% if project.risks %}
{% for risk in project.risks %}
**{{ risk.title }}** - {{ risk.severity|upper }} RISK
- **Impact:** {{ risk.impact }}
- **Probability:** {{ risk.probability }}%
- **Mitigation:** {{ risk.mitigation_plan }}
{% endfor %}
{% else %}
No significant risks identified.
{% endif %}

**Overall Health Score:** {{ project.health_score }}/10
```

**Sample Variables:**
```json
{
  "project": {
    "name": "Customer Portal Redesign",
    "manager": {
      "name": "Sarah Johnson",
      "email": "sarah.j@company.com"
    },
    "start_date": "2025-06-01",
    "target_date": "2025-12-15",
    "budget": 125000,
    "status": "at_risk",
    "team": [
      {
        "name": "Mike Chen",
        "role": "Lead Developer",
        "email": "mike.c@company.com",
        "utilization": 80,
        "skills": ["React", "Node.js", "MongoDB"]
      },
      {
        "name": "Lisa Rodriguez",
        "role": "UX Designer",
        "email": "lisa.r@company.com", 
        "utilization": 60,
        "skills": ["Figma", "User Research", "Prototyping"]
      }
    ],
    "milestones": [
      {
        "name": "Requirements Gathering",
        "target_date": "2025-07-01",
        "completed": true,
        "completion_date": "2025-06-28",
        "in_progress": false,
        "deliverables": [
          {"name": "Requirements Document", "status": "Approved"},
          {"name": "User Stories", "status": "Approved"}
        ]
      },
      {
        "name": "Design Phase",
        "target_date": "2025-08-15",
        "completed": false,
        "in_progress": true,
        "deliverables": [
          {"name": "Wireframes", "status": "In Review"},
          {"name": "Mockups", "status": "In Progress"}
        ]
      }
    ],
    "risks": [
      {
        "title": "Resource Availability",
        "severity": "medium",
        "impact": "Could delay delivery by 2-3 weeks",
        "probability": 40,
        "mitigation_plan": "Identify backup resources and cross-train team members"
      }
    ],
    "health_score": 7
  },
  "quarter": "Q3 2025"
}
```

**Expected Output:**
```
# Customer Portal Redesign - Q3 2025 Status Report

**Project Information:**
- **Manager:** Sarah Johnson (sarah.j@company.com)
- **Start Date:** 2025-06-01
- **Target Completion:** 2025-12-15
- **Budget:** $125000
- **Status:** 🟡 At Risk

## Team Members (2)

**Mike Chen** - Lead Developer
- Email: mike.c@company.com
- Utilization: 80%
- Skills: React, Node.js, MongoDB

**Lisa Rodriguez** - UX Designer
- Email: lisa.r@company.com
- Utilization: 60%
- Skills: Figma, User Research, Prototyping

## Milestones Progress

### Requirements Gathering
- **Target:** 2025-07-01
- **Status:** ✅ Completed (2025-06-28)
- **Deliverables:**
  - Requirements Document (Approved)
  - User Stories (Approved)

### Design Phase
- **Target:** 2025-08-15
- **Status:** 🔄 In Progress
- **Deliverables:**
  - Wireframes (In Review)
  - Mockups (In Progress)

## Risk Assessment

**Resource Availability** - MEDIUM RISK
- **Impact:** Could delay delivery by 2-3 weeks
- **Probability:** 40%
- **Mitigation:** Identify backup resources and cross-train team members

**Overall Health Score:** 7/10
```

---

## Business Document Templates

### Example 9: Sales Report

**Template:**
```pongo2
# {{ company_name }} Sales Report
## {{ report_period }}

**Report Generated:** {{ generation_date }}
**Prepared by:** {{ prepared_by }}

---

## Executive Summary

**Total Revenue:** ${{ summary.total_revenue|floatformat:2 }}
**Revenue Growth:** {% if summary.growth_rate >= 0 %}📈 +{{ summary.growth_rate|floatformat:1 }}%{% else %}📉 {{ summary.growth_rate|floatformat:1 }}%{% endif %}
**Units Sold:** {{ summary.units_sold|floatformat:0 }}
**Average Order Value:** ${{ summary.avg_order_value|floatformat:2 }}

## Sales by Region

{% for region in regions %}
### {{ region.name }}
- **Revenue:** ${{ region.revenue|floatformat:2 }} ({{ region.percentage|floatformat:1 }}% of total)
- **Units Sold:** {{ region.units|floatformat:0 }}
- **Top Rep:** {{ region.top_rep.name }} (${{ region.top_rep.sales|floatformat:2 }})
{% endfor %}

## Top Products

{% for product in top_products %}
{{ forloop.Counter }}. **{{ product.name }}**
   - Revenue: ${{ product.revenue|floatformat:2 }}
   - Units: {{ product.units_sold }}
   - Category: {{ product.category }}
   - Growth: {% if product.growth >= 0 %}+{{ product.growth|floatformat:1 }}%{% else %}{{ product.growth|floatformat:1 }}%{% endif %}
{% endfor %}

## Sales Team Performance

{% for rep in sales_reps %}
**{{ rep.name }}** ({{ rep.territory }})
- Revenue: ${{ rep.revenue|floatformat:2 }}
- Target Achievement: {{ rep.target_achievement|floatformat:1 }}%{% if rep.target_achievement >= 100 %} ✅{% elif rep.target_achievement >= 80 %} ⚠️{% else %} ❌{% endif %}
- Deals Closed: {{ rep.deals_closed }}
{% endfor %}

## Key Insights

{% for insight in key_insights %}
- **{{ insight.title }}:** {{ insight.description }}
{% endfor %}

## Action Items

{% for action in action_items %}
- [ ] **{{ action.task }}** (Owner: {{ action.owner }}, Due: {{ action.due_date }})
{% endfor %}

---
---
*Next report due: {{ next_report_date }}*
```

---

## Travel Itinerary Generator

### Example 10: European Travel Itinerary

You are a travel itinerary generator for European tourists.
Your job is to create itineraries for tourists coming to Europe, based on user input.
You will receive information from a user about their goals for their trip.
You will generate an in-depth travel itinerary for users.
Do not use the internet.
Do not hallucinate.
You must address all of what the user provides.
You must have a catchy title.
You must bullet point every sentence.
Your output must be in a logical format and order.
Address the user by name if it is given.
Come up with at least 2 ideas the user may not have mentioned.
Output 1-2 lines of a history of each place suggested.
Provide 1-2 lines of current cultural background on the place provided.
Provide 1-2 lines of weather related advice for each place suggested.
Provide one line of rationale for each place suggested.
Include one joke in the itinerary.
End the itinerary with a clever, place-related goodbye.


**Template:**
```pongo2
# 🌍 {{ itinerary_title }}

{% if traveler_name %}Hello {{ traveler_name }}! {% endif %}
You are a travel itinerary generator for European tourists.

• Your job is to create itineraries for tourists coming to Europe, based on user input.
• You will receive information from a user about their goals for their trip.
• You will generate an in-depth travel itinerary for users.
• Do not use the internet.
• Do not hallucinate.
• You must address all of what the user provides.
• You must have a catchy title.
• You must bullet point every sentence.
• Your output must be in a logical format and order.
• Address the user by name if it is given.
• Come up with at least 2 ideas the user may not have mentioned.
• Output 1-2 lines of a history of each place suggested.
• Provide 1-2 lines of current cultural background on the place provided.
• Provide 1-2 lines of weather related advice for each place suggested.
• Provide one line of rationale for each place suggested.
• Include one joke in the itinerary.
• End the itinerary with a clever, place-related goodbye.

## � Trip Overview

• **Destination Focus:** {{ trip_focus }}
• **Travel Duration:** {{ duration }}
• **Travel Style:** {{ travel_style }}
• **Budget Range:** {{ budget_range }}

## 🗺️ First Destination:

**📍 Why Visit:**


**🏛️ Historical Background:**


**🎭 Cultural Highlights:**


**🌤️ Weather Advice:**


**🎯 Must-Do Activities:**


**🍽️ Local Cuisine:**


## 🗺️ Second Destination: 

**📍 Why Visit:**


**🏛️ Historical Background:**


**🎭 Cultural Highlights:**


**🌤️ Weather Advice:**


**🎯 Must-Do Activities:**


**🍽️ Local Cuisine:**


## 💡 Bonus Ideas You May Not Have Considered

### bonus idea1 title 
• bonus idea1 description
• **Best Time:** 
• **Why It's Special:** 

### bonus_idea2_title 
• bonus idea2 description
• **Best Time:** 
• **Why It's Special:** 

## 🎭 Fun Fact Corner
travel joke

## 🎒 Essential Travel Tips

• **Transportation:** 
• **Currency:** 
• **Language:** 
• **Cultural Etiquette:** 

---

clever goodbye

*Safe travels and create memories that will last a lifetime!* ✈️🌟
```

**Sample Variables:**
```json
{
  "traveler_name": "Emma",
  "itinerary_title": "Enchanting European Heritage Trail",
  "trip_focus": "Medieval History & Art",
  "duration": "12 days",
  "travel_style": "Cultural immersion with historical focus",
  "budget_range": "Mid to high-range",
  
}


{ //extra not needed
"destination1_city": "Prague",
  "destination1_country": "Czech Republic",
  "destination1_rationale": "Prague offers the best-preserved medieval old town in Europe with stunning Gothic and Baroque architecture",
  "destination1_history": "Founded around 885 AD, Prague served as the seat of the Holy Roman Empire and survived both World Wars largely intact",
  "destination1_culture": "Prague is renowned for its classical music tradition and hosts over 100 concerts daily alongside a thriving contemporary art scene",
  "destination1_weather": "Pack layers for September - days are mild (15-20°C) but evenings can be cool, and bring a light raincoat",
  "destination1_activity1": "Explore Prague Castle complex and St. Vitus Cathedral",
  "destination1_activity2": "Walk across the iconic Charles Bridge at sunrise",
  "destination1_activity3": "Tour the historic Jewish Quarter and synagogues",
  "destination1_food1": "Traditional goulash with bread dumplings",
  "destination1_food2": "Trdelník (chimney cake) from Old Town Square",
  "destination2_city": "Florence",
  "destination2_country": "Italy",
  "destination2_rationale": "Florence is the birthplace of the Renaissance and houses the world's greatest collection of Renaissance art",
  "destination2_history": "Florence was the center of medieval European trade and the powerful Medici family patronized artists like Michelangelo and Leonardo da Vinci",
  "destination2_culture": "Modern Florence maintains its artisan traditions with leather crafting, goldsmithing, and preserves Renaissance urban planning as a living museum",
  "destination2_weather": "September weather is perfect (18-25°C) but popular sites get crowded - book museum tickets in advance and visit early morning",
  "destination2_activity1": "Pre-book Uffizi Gallery to see Botticelli's Birth of Venus",
  "destination2_activity2": "Climb the Duomo dome for panoramic city views",
  "destination2_activity3": "Explore Oltrarno district for authentic artisan workshops",
  "destination2_food1": "Bistecca alla Fiorentina (Florentine steak)",
  "destination2_food2": "Ribollita soup and pappardelle pasta",
  "bonus_idea1_title": "Sunrise Hot Air Balloon Over Tuscany",
  "bonus_idea1_description": "Experience the rolling hills of Tuscany from above with a peaceful hot air balloon ride",
  "bonus_idea1_timing": "Early morning (6-8 AM) for optimal weather and lighting",
  "bonus_idea1_special": "Unique perspective of medieval hilltop towns and vineyards that few tourists experience",
  "bonus_idea2_title": "Underground Prague - Medieval Tunnels Tour",
  "bonus_idea2_description": "Explore the hidden underground medieval tunnels and chambers beneath Prague's Old Town",
  "bonus_idea2_timing": "Evening tours available year-round",
  "bonus_idea2_special": "Discover the secret history of medieval Prague that most visitors never see",
  "travel_joke": "Why don't tourists ever get lost in Prague? Because all roads lead to the castle... and when they don't, there's always a helpful local pointing in six different directions! 😄",
  "transportation_tip": "Eurail Pass covers most routes between major cities - book seat reservations in advance for high-speed trains",
  "currency_tip": "Czech Republic uses Czech Crown (CZK), Italy uses Euro (EUR) - many places accept cards but carry some cash for small vendors",
  "language_tip": "Download Google Translate with offline mode - locals appreciate any attempt to speak their language, even basic phrases",
  "etiquette_tip": "In Czech Republic, maintain eye contact when toasting; in Italy, dress modestly when visiting churches and religious sites",
  "clever_goodbye": "May your journey be filled with as many discoveries as there are cobblestones in Prague's Old Town, and may each sunset in Florence paint memories as beautiful as a Renaissance masterpiece! Arrivederci and na shledanou! 🏰🎨"
  }
```

**Expected Output:**
```
# 🌍 Enchanting European Heritage Trail

Hello Emma! You are a travel itinerary generator for European tourists.

• Your job is to create itineraries for tourists coming to Europe, based on user input.
• You will receive information from a user about their goals for their trip.
• You will generate an in-depth travel itinerary for users.
• Do not use the internet.
• Do not hallucinate.
• You must address all of what the user provides.
• You must have a catchy title.
• You must bullet point every sentence.
• Your output must be in a logical format and order.
• Address the user by name if it is given.
• Come up with at least 2 ideas the user may not have mentioned.
• Output 1-2 lines of a history of each place suggested.
• Provide 1-2 lines of current cultural background on the place provided.
• Provide 1-2 lines of weather related advice for each place suggested.
• Provide one line of rationale for each place suggested.
• Include one joke in the itinerary.
• End the itinerary with a clever, place-related goodbye.

## 📋 Trip Overview

• **Destination Focus:** Medieval History & Art
• **Travel Duration:** 12 days
• **Travel Style:** Cultural immersion with historical focus
• **Budget Range:** Mid to high-range

## 🗺️ First Destination: Prague, Czech Republic

**📍 Why Visit:**
• Prague offers the best-preserved medieval old town in Europe with stunning Gothic and Baroque architecture

**🏛️ Historical Background:**
• Founded around 885 AD, Prague served as the seat of the Holy Roman Empire and survived both World Wars largely intact

**🎭 Cultural Highlights:**
• Prague is renowned for its classical music tradition and hosts over 100 concerts daily alongside a thriving contemporary art scene

**🌤️ Weather Advice:**
• Pack layers for September - days are mild (15-20°C) but evenings can be cool, and bring a light raincoat

**🎯 Must-Do Activities:**
• Explore Prague Castle complex and St. Vitus Cathedral
• Walk across the iconic Charles Bridge at sunrise
• Tour the historic Jewish Quarter and synagogues

**🍽️ Local Cuisine:**
• Traditional goulash with bread dumplings
• Trdelník (chimney cake) from Old Town Square

## 🗺️ Second Destination: Florence, Italy

**📍 Why Visit:**
• Florence is the birthplace of the Renaissance and houses the world's greatest collection of Renaissance art

**🏛️ Historical Background:**
• Florence was the center of medieval European trade and the powerful Medici family patronized artists like Michelangelo and Leonardo da Vinci

**🎭 Cultural Highlights:**
• Modern Florence maintains its artisan traditions with leather crafting, goldsmithing, and preserves Renaissance urban planning as a living museum

**🌤️ Weather Advice:**
• September weather is perfect (18-25°C) but popular sites get crowded - book museum tickets in advance and visit early morning

**🎯 Must-Do Activities:**
• Pre-book Uffizi Gallery to see Botticelli's Birth of Venus
• Climb the Duomo dome for panoramic city views
• Explore Oltrarno district for authentic artisan workshops

**🍽️ Local Cuisine:**
• Bistecca alla Fiorentina (Florentine steak)
• Ribollita soup and pappardelle pasta

## 💡 Bonus Ideas You May Not Have Considered

### Sunrise Hot Air Balloon Over Tuscany
• Experience the rolling hills of Tuscany from above with a peaceful hot air balloon ride
• **Best Time:** Early morning (6-8 AM) for optimal weather and lighting
• **Why It's Special:** Unique perspective of medieval hilltop towns and vineyards that few tourists experience

### Underground Prague - Medieval Tunnels Tour
• Explore the hidden underground medieval tunnels and chambers beneath Prague's Old Town
• **Best Time:** Evening tours available year-round
• **Why It's Special:** Discover the secret history of medieval Prague that most visitors never see

## 🎭 Fun Fact Corner
Why don't tourists ever get lost in Prague? Because all roads lead to the castle... and when they don't, there's always a helpful local pointing in six different directions! 😄

## 🎒 Essential Travel Tips

• **Transportation:** Eurail Pass covers most routes between major cities - book seat reservations in advance for high-speed trains
• **Currency:** Czech Republic uses Czech Crown (CZK), Italy uses Euro (EUR) - many places accept cards but carry some cash for small vendors
• **Language:** Download Google Translate with offline mode - locals appreciate any attempt to speak their language, even basic phrases
• **Cultural Etiquette:** In Czech Republic, maintain eye contact when toasting; in Italy, dress modestly when visiting churches and religious sites

---

May your journey be filled with as many discoveries as there are cobblestones in Prague's Old Town, and may each sunset in Florence paint memories as beautiful as a Renaissance masterpiece! Arrivederci and na shledanou! 🏰🎨

*Safe travels and create memories that will last a lifetime!* ✈️🌟
```

---

## Usage Tips
```

**Sample Variables:**
```json
{
  "company_name": "TechSolutions Inc.",
  "report_period": "Q3 2025",
  "generation_date": "2025-09-15",
  "prepared_by": "Sales Analytics Team",
  "summary": {
    "total_revenue": 2450000.00,
    "growth_rate": 12.5,
    "units_sold": 8750,
    "avg_order_value": 280.00
  },
  "regions": [
    {
      "name": "North America",
      "revenue": 1470000.00,
      "percentage": 60.0,
      "units": 5250,
      "top_rep": {
        "name": "John Smith",
        "sales": 425000.00
      }
    },
    {
      "name": "Europe",
      "revenue": 735000.00,
      "percentage": 30.0,
      "units": 2625,
      "top_rep": {
        "name": "Marie Dubois",
        "sales": 280000.00
      }
    }
  ],
  "top_products": [
    {
      "name": "Enterprise Software License",
      "revenue": 980000.00,
      "units_sold": 1400,
      "category": "Software",
      "growth": 18.5
    },
    {
      "name": "Professional Services",
      "revenue": 735000.00,
      "units_sold": 420,
      "category": "Services",
      "growth": 8.2
    }
  ],
  "sales_reps": [
    {
      "name": "John Smith",
      "territory": "West Coast",
      "revenue": 425000.00,
      "target_achievement": 106.3,
      "deals_closed": 28
    },
    {
      "name": "Sarah Chen",
      "territory": "East Coast",
      "revenue": 380000.00,
      "target_achievement": 95.0,
      "deals_closed": 24
    }
  ],
  "key_insights": [
    {
      "title": "Software License Growth",
      "description": "Enterprise software licenses showed strong 18.5% growth, driven by digital transformation initiatives"
    },
    {
      "title": "Regional Performance",
      "description": "North America continues to be our strongest market with 60% of total revenue"
    }
  ],
  "action_items": [
    {
      "task": "Develop EMEA expansion strategy",
      "owner": "Strategic Planning Team",
      "due_date": "2025-10-15"
    },
    {
      "task": "Launch upselling campaign for existing clients",
      "owner": "Sales Team",
      "due_date": "2025-10-01"
    }
  ],
  "next_report_date": "2025-12-15"
}
```

**Expected Output:**
```
# TechSolutions Inc. Sales Report
## Q3 2025

**Report Generated:** 2025-09-15
**Prepared by:** Sales Analytics Team

---

## Executive Summary

**Total Revenue:** $2450000.00
**Revenue Growth:** 📈 +12.5%
**Units Sold:** 8750
**Average Order Value:** $280.00

## Sales by Region

### North America
- **Revenue:** $1470000.00 (60.0% of total)
- **Units Sold:** 5250
- **Top Rep:** John Smith ($425000.00)

### Europe
- **Revenue:** $735000.00 (30.0% of total)
- **Units Sold:** 2625
- **Top Rep:** Marie Dubois ($280000.00)

## Top Products

1. **Enterprise Software License**
   - Revenue: $980000.00
   - Units: 1400
   - Category: Software
   - Growth: +18.5%
2. **Professional Services**
   - Revenue: $735000.00
   - Units: 420
   - Category: Services
   - Growth: +8.2%

## Sales Team Performance

**John Smith** (West Coast)
- Revenue: $425000.00
- Target Achievement: 106.3% ✅
- Deals Closed: 28

**Sarah Chen** (East Coast)
- Revenue: $380000.00
- Target Achievement: 95.0% ⚠️
- Deals Closed: 24

## Key Insights

- **Software License Growth:** Enterprise software licenses showed strong 18.5% growth, driven by digital transformation initiatives
- **Regional Performance:** North America continues to be our strongest market with 60% of total revenue

## Action Items

- [ ] **Develop EMEA expansion strategy** (Owner: Strategic Planning Team, Due: 2025-10-15)
- [ ] **Launch upselling campaign for existing clients** (Owner: Sales Team, Due: 2025-10-01)

---
*Next report due: 2025-12-15*
```

---

## Usage Tips

### 1. Variable Naming
- Use descriptive variable names: `user_name` instead of `name`
- Use snake_case for consistency: `order_total` not `orderTotal`
- Avoid reserved words and special characters

### 2. Data Types
- **Strings**: `"Hello World"`
- **Numbers**: `42`, `3.14`
- **Booleans**: `true`, `false`
- **Arrays**: `["item1", "item2", "item3"]`
- **Objects**: `{"key": "value", "nested": {"data": true}}`

### 3. Common Filters
- `|default:"fallback"` - Use fallback if variable is empty
- `|length` - Get length of string or array
- `|floatformat:2` - Format numbers with 2 decimal places
- `|title` - Capitalize first letter of each word
- `|upper` / `|lower` - Convert case
- `|join:", "` - Join array elements with comma

### 4. Loop Variables
- `forloop.Counter` - 1-based index (1, 2, 3...)
- `forloop.Counter0` - 0-based index (0, 1, 2...)
- `forloop.First` - True for first iteration
- `forloop.Last` - True for last iteration

### 5. Testing Your Templates
The pongo2 activity automatically detects variables in your templates and generates the appropriate JSON schema.

To test template functionality:
```bash
cd extensions/pongo2/src/activity/pongo2
go test -v -run TestJinja2PromptActivity
```

The schema provider will automatically detect variables and create input fields in the Flogo Web UI.
