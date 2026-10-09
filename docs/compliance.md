\# Compliance, Privacy, and Prototype Limitations



\## Scope



Rupee+ is a software prototype demonstrating micro-savings allocation and personalized micro-insurance workflows. This document describes prototype limitations; it is not a legal opinion, compliance certification, or regulatory approval.



\## Mock integrations



The repository contains mock integration modules for:



\* UPI

\* Account aggregation

\* Insurer interactions



These mock modules do not establish connectivity to live providers, successful payment execution, consented access to financial accounts, or binding insurer decisions. Review each implementation before relying on its behavior.



\## Financial and insurance limitations



\* Premium calculations are prototype estimates, not binding insurance quotes.

\* A coverage status returned by the application is not proof that a real insurance policy exists or that a claim is payable.

\* Claim decisions made through a mock insurer are simulated.

\* Round-up allocations and wallet balances must not be treated as actual money held in a regulated account.



\## Data handling and security



Review the implementation and deployment configuration before using real personal or financial data. In particular, verify:



\* Authentication and authorization for user-specific operations.

\* Storage durability, access controls, encryption, and retention.

\* Input validation and protection against abuse.

\* Logging practices and handling of sensitive information.

\* Secrets management and production configuration.

\* Consent and access controls for any future financial-data integrations.



Do not use real customer financial data in an unreviewed development deployment.



\## Production readiness



Before real-world deployment, obtain appropriate legal, security, privacy, and domain-expert review. Confirm applicable licensing and regulatory obligations, provider agreements, consumer disclosures, data-protection requirements, monitoring, and incident response.



No compliance certification or production-readiness claim is made by this document.
