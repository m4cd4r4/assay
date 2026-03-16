# Assay Data Handling Policy

## Overview

This document describes how Assay (operated by Solaisoft Pty Ltd) handles customer source code and data throughout the engagement lifecycle.

---

## 1. Data Intake

### Accepted Methods
| Method | Encryption | Notes |
|--------|-----------|-------|
| SFTP | AES-256 in transit | Preferred for large codebases |
| Encrypted ZIP (AES-256) | Password shared via separate channel | Suitable for smaller engagements |
| Secure file sharing (e.g., Tresorit) | E2E encrypted | Customer's choice of provider |

### Accepted File Types
- `.cbl`, `.cob` — COBOL source programs
- `.cpy` — COBOL copybooks
- `.jcl` — Job Control Language (for dependency analysis)
- `.txt`, `.md` — Supplementary documentation
- `.zip`, `.tar.gz` — Archive formats

### Rejected File Types
- Executables (`.exe`, `.dll`, `.so`)
- Database dumps or production data
- Credentials, keys, or certificates
- Any file containing PII or customer data

## 2. Processing Pipeline

```
Encrypted Transfer
  → Local staging (in-memory where possible)
  → File classification (.cbl vs .cpy)
  → Sequence number stripping
  → Regex structural parsing (local, no API call)
  → File grouping (<800K tokens per batch)
  → Anthropic API calls (TLS 1.3)
     ├─ Commercial terms: inputs NOT used for training
     ├─ No persistent storage by Anthropic
     └─ Processing region: US (Anthropic infrastructure)
  → Output assembly (markdown + Mermaid diagrams)
  → Knowledge base packaging
  → Delivery via secure download link
```

### Key Safeguards During Processing
- Source code transmitted to Anthropic API only over TLS 1.3
- Anthropic commercial terms: customer inputs are **not stored or used for model training**
- No source code is written to disk in unencrypted form
- No source code is logged, cached, or backed up beyond the active processing session
- Processing performed by the Director of Solaisoft Pty Ltd only

## 3. Delivery

### Method
- Time-limited secure download link (expires after 7 days)
- Customer notified via email when documentation is ready
- Download link requires authentication

### Deliverables
- Searchable markdown knowledge base (ZIP archive)
- Per-program documentation (overview, business rules, dead code, data flow)
- System dependency diagrams (Mermaid format)
- Executive summary with statistics
- Table of contents and index

## 4. Data Retention and Deletion

| Data Type | Retention | Deletion Method |
|-----------|-----------|----------------|
| Source code (customer-provided) | Deleted within **30 calendar days** of delivery | Secure deletion from all storage |
| Working copies (processing) | Deleted immediately after processing | Process termination clears memory |
| Generated documentation | Retained until customer requests deletion | Secure deletion upon request |
| Business contact information | Duration of relationship + 7 years | Per Australian tax law requirements |
| Invoices and payment records | 7 years | Per Australian tax law requirements |
| Engagement correspondence | 3 years | Deleted after retention period |

### Deletion Confirmation
Upon request, Solaisoft Pty Ltd will provide:
- Written confirmation that all source code copies have been destroyed
- List of systems from which data was deleted
- Date and method of deletion
- Signed by the Director

## 5. Access Control

### Personnel with Source Code Access
| Person | Role | Access Level |
|--------|------|-------------|
| Macdara (Director) | Sole operator | Full access during processing |

No other employees, contractors, subcontractors, or third parties have access to customer source code at any time.

### Third-Party Processors
| Processor | Purpose | Data Shared | Terms |
|-----------|---------|-------------|-------|
| Anthropic | AI analysis | Source code (transient) | Commercial API terms — no training |
| Stripe | Payments | Billing details only | PCI-DSS Level 1 |
| Vercel | Web hosting | No source code | Website only |

## 6. Incident Response

In the event of a data security incident involving customer source code:

1. **Immediate** (within 1 hour): Contain the incident, revoke access
2. **Within 24 hours**: Notify affected customer(s) in writing
3. **Within 72 hours**: Provide detailed incident report including:
   - Nature and scope of the incident
   - Data potentially affected
   - Remediation steps taken
   - Preventive measures implemented
4. **Within 30 days**: Provide final incident report

### Notification
- Primary contact: Via email and phone
- Regulatory: OAIC notification if required under the Notifiable Data Breaches scheme

## 7. Customer Rights

Customers may at any time:
- Request a list of all data held about them
- Request deletion of their source code (expedited — within 7 days)
- Request deletion of generated documentation
- Request written confirmation of deletion
- Request information about processing activities
- Withdraw consent for processing (engagement will be terminated)

## 8. Compliance

| Regulation | Status | Notes |
|-----------|--------|-------|
| Australian Privacy Act 1988 | Compliant | Minimal data collection |
| Notifiable Data Breaches scheme | Compliant | Incident response plan in place |
| GDPR (if EU customers) | Compliant by design | No persistent storage, deletion within 30 days |
| SOC 2 | Not certified | Not required for read-only documentation service |

## 9. Policy Review

This policy is reviewed annually or whenever there is a material change to our processing activities. Last reviewed: February 2026.

---

**Solaisoft Pty Ltd** trading as Assay
Perth, Western Australia
privacy@assay.software
