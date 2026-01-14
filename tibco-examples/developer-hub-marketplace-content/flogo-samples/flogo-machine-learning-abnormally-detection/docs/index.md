# Flogo Machine Learning Isolation Forest Abnormally Detection

This sample uses TIBCO Flogo in tandem with Python Scikit-learn open-source machine learning library to demonstrate Artificial Intelligence Machine Learning (AI-ML) in a real-time eventing scenario deployable into the TIBCO Platform. 

The sample demonstrate 

- Few-shot training to train Machine Learning models.
- Training and inferencing can be done in real-time eventing scenario.
- Self healing are employed in the data set in case the norm shifts.
- TIBCO Platform can be used for AI-ML use-cases.

The use-case in this sample is the monitoring of temperature in a machine inside a manufacturing plant. The temperature of the machine can vary depending on the geographic location and the environment that it is operating in. Thereby, it is hard to pinpoint what would be the expected temperature range. However, during operation, the temperature is expected to be relatively stable.

Although this use-case is focused on machinery, this same technique can be applicable in various other scenarios such as

* Banking: Monitoring the spend of credit cards in a region where the "normal" range is unknown to start with. If the amount is abnormal, it needs to be flaged for further investigation
* Computing: The usage of a system resource is expected to be relatively stable based on an install set but its initial range is unknown.
* ...

> [!NOTE]
> Scikit-learn's Isolation Forest is a technique used to find unusual data points or outliers in a dataset. It randomly partition in a tree and scores the data points based on the path length to the node. A node with the shorter path length is identified as different that the rest of the data points. This algorithm works in the cases where anomalies are rare and different. A detail explaination of Isolation Forest algorithm can be found at this link. 
https://www.datacamp.com/tutorial/isolation-forest

What is the significant of this sample?
* Although the sample uses Scikit-learn Isolation Forest algorithm, TIBCO Customers can leverage the already vast and well established Python machine learning tools and frameworks working in tandem with the TIBCO Platform.
* Artificial Intelligence Machine Learning, both training and inferencing can be leverage in a real-time eventing scenario.  
* ...

The documentation below shows you the detail steps on how your can use this sample.

## Table of Contents

1. [Pre-requisite](#prereq)
2. [Running Locally](#local)
3. [Deployment To TIBCO Platform](#platform)
5. [Frequently Asked Questions](#faq)
6. [References](#ref)

<a name="prereq" />

## Pre-requisite

The following software is needed to run this sample. 

* Microsoft Visual Studio Code
* TIBCO Flogo® Extension for Visual Studio Code
* Python
* Docker (for deployment)
* TIBCO Platform (for deployment)

### Microsoft Visual Studio Code

1. Download and install Visual Studio Code from https://code.visualstudio.com/download

### TIBCO Flogo Extension for Visual Studio Code

1. Download TIBCO Flogo Extension for Visual Studio Code from https://www.tibco.com/downloads

2. Inside Visual Studio Code, go to Extensions and install the downloaded extension.

### Python

1.  Download and install Python from https://www.python.org/downloads/

2. Inside Visual Studio Code, go to Extensions and install the Python extension for Visual Studio Code by Microsoft

<a name="local" />

## Running Locally

The sample can be run from within Visual Studio Code. The follow are the steps to run this. 

1. Open a terminal windows to be used for Python.
    * Create virtual environment
        ```
        python -m venv .venv
        ```
    * Activate the virtual environment
        ```
        Windows: .venv\Scripts\activate 
        ```
    * Install required packages
        ```
        pip install -r requirements.txt
        or
        pip install scikit-learn
        pip install numpy
        pip install fastapi[standard]
        ```
    * Upgrade pip (optional)
        ```
        python.exe -m pip install --upgrade pip
        ```
    * Run the program
        ```
        # To execute the test program
        python main.py
        
        or 
        
        # To start the REST listener called by Flogo
        fastapi run main.py
        ````
2. Open the MachineTemperature.flogo, select a Flogo Runtime and click Run.

3. You will see print out in the Flogo application and the Python application which shows first the few-shot training being executed followed by abnormally detection reporting temperature which are normal and temperature which are not.

<a name="platform" />

## Deploy To TIBCO Platform

Use the steps below to deploy this sample into TIBCO Platform.

1. Execute the script deploy.sh from a machine that have access to the Platform Kubernetes Cluster where kubectl can be executed. 

> [!NOTE]
> You will need to change the CONTAINER_REGISTRY_IMAGE variable in the script to point to your containr registry. You will also need to login your container registry from docker. Alternatively, you can run the createlocalregisry.sh script to create a local registry in the same Kubernetes cluster.

2. Deploy and run the Flogo application into TIBCO Platform.

> [!NOTE]
> Remember to change the App Properties "URL_IsAbnormal" and "URL_IsAbnormal" to point to the deployed Python service endpoint. This will likely be pythonmlif.python.svc.cluster.local

<a name="faq" />

## Frequently Asked Questions

This section are some of the questions that are asked about this sample. 

1. Can I use this for all obnormally detection use-cases?
   * Just like any machine learning algorithm, Isolation Forest is suitable for detecting abnormally that have specific characteristic. However, you can choose and deploy other algorithms that would satisfy your use-case.

2. How do you scale up this sample?
   * Given that Python deployed in Kubernetes, you can use Native Kubernetes load balancing and scaling mechanism to adjust to the workload.

<a name="ref" />

## References
- Source Code: https://github.com/TIBCOSoftware/flogo-enterprise-hub/blob/master/demos/flogo-machine-learning-anomaly-detection/
- TIBCO Flogo Enterprise Documentation: https://docs.tibco.com/pub/flogo/2.25.8/doc/html/Default.htm
- skikit-learn: https://scikit-learn.org/stable/index.html
- skikit-learn IsolationForest API Reference: https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html
