'use client';
import React, { useState } from 'react';
import { BookOpen, FileText, ClipboardList, TestTube, Bug, ChevronDown, ChevronUp, Download, Copy, CheckCircle2 } from 'lucide-react';
import toast from '@/lib/toast';

const EXAMPLES = [
  {
    id: 'project',
    icon: FileText,
    color: 'bg-blue-100 text-blue-700',
    title: 'Project Setup Example',
    subtitle: 'E-Commerce Platform — Mobile App',
    description: 'A real-world example of how to set up a project with all required details, objectives, scope, and team assignments.',
    sections: [
      {
        heading: 'Project Overview',
        content: `Project Name: ShopEase Mobile App v2.0
Client: RetailCo Ltd.
Project Manager: Sarah Chen
QA Lead: James Patel
Start Date: 2026-07-01
Go-Live Target: 2026-09-30

Description:
Complete rewrite of the native mobile shopping app for iOS and Android. The new version introduces AI-powered product recommendations, one-click checkout, and real-time order tracking.`
      },
      {
        heading: 'Scope',
        content: `In Scope:
• User authentication (login, register, SSO via Google/Apple)
• Product catalog with search and filters
• Shopping cart and wishlist
• Checkout flow (payment via Stripe, PayPal)
• Order tracking and notifications
• User profile and order history

Out of Scope:
• Admin/CMS portal (separate project)
• Vendor management portal
• Loyalty points system (v3.0)
• Web browser version`
      },
      {
        heading: 'Documents Uploaded',
        content: `✓ BRD — Business Requirements Document v1.2
✓ HLD — High-Level Design document v2.0
✓ LLD — Low-Level Design (API specs) v1.0
✓ FRS — Functional Requirements Spec v1.3
✓ Wireframes — Figma export (84 screens)
✓ API Contract — Swagger YAML`
      },
    ]
  },
  {
    id: 'strategy',
    icon: ClipboardList,
    color: 'bg-purple-100 text-purple-700',
    title: 'Test Strategy Example',
    subtitle: 'E-Commerce Mobile App',
    description: 'Enterprise-grade test strategy covering all 13 sections — from scope to reporting.',
    sections: [
      {
        heading: '1. Scope',
        content: `This strategy covers functional, performance, security, and usability testing for ShopEase Mobile App v2.0 across iOS (14+) and Android (10+).`
      },
      {
        heading: '2. Risk Assessment',
        content: `HIGH: Payment gateway integration — financial impact if broken
HIGH: Authentication — security breach risk
MEDIUM: Push notifications — depends on 3rd party (Firebase)
MEDIUM: Search performance — impacts user retention
LOW: Profile photo upload — non-critical feature`
      },
      {
        heading: '3–6. Testing Levels',
        content: `Unit Testing (Dev responsibility):
• Coverage target: ≥80% for business logic layer
• Framework: Jest (React Native) + XCTest (iOS native)

Integration Testing:
• API contract testing using Postman collections
• All 47 endpoints covered
• Test environment: https://staging-api.shopease.com

System Testing:
• End-to-end user journeys: 12 critical flows
• Cross-device matrix: 8 devices (4 iOS, 4 Android)
• Regression suite: 320 automated test cases

UAT:
• 5 business users from RetailCo QA team
• Duration: 2 weeks
• Acceptance criteria: 0 Critical, 0 High defects open`
      },
      {
        heading: '11. Entry & Exit Criteria',
        content: `Entry Criteria:
• Dev sign-off on feature branch
• Build deployed to test environment
• Smoke test suite passes (100%)
• Test data loaded

Exit Criteria:
• All planned test cases executed
• 0 Critical defects open
• 0 High defects open (or risk-accepted)
• ≤5 Medium defects open
• Test summary report approved by Test Manager`
      },
      {
        heading: '12. Defect Management',
        content: `Tool: Jira (https://shopease.atlassian.net)
Workflow: Open → In Progress → In Review → Resolved → Closed
SLA:
  Critical — Fix within 4 hours
  High — Fix within 1 business day
  Medium — Fix within 5 business days
  Low — Backlog, next sprint

Severity vs Priority matrix maintained in Confluence.`
      },
      {
        heading: '13. Reporting',
        content: `Daily: Test execution summary (Slack #qa-daily)
Weekly: Test progress report to stakeholders (email)
Sprint end: Defect trend analysis + test coverage report
Go/No-Go meeting: Final test summary with sign-off`
      },
    ]
  },
  {
    id: 'testplan',
    icon: BookOpen,
    color: 'bg-green-100 text-green-700',
    title: 'Test Plan Example',
    subtitle: 'Checkout Flow — Sprint 4',
    description: '26-section enterprise test plan for a critical payment flow feature.',
    sections: [
      {
        heading: 'Introduction & Objectives',
        content: `This test plan covers the end-to-end checkout flow for ShopEase v2.0 including cart management, address input, payment processing (Stripe + PayPal), order confirmation, and notification delivery.

Objectives:
1. Verify all payment methods work correctly
2. Ensure PCI-DSS compliance requirements are met
3. Validate order lifecycle from placement to confirmation
4. Test failure scenarios and rollback mechanisms`
      },
      {
        heading: 'Test Environment',
        content: `Environment: Staging
URL: https://staging.shopease.com
API Base: https://staging-api.shopease.com/v2
iOS Devices: iPhone 14 Pro (iOS 17), iPhone 12 (iOS 15)
Android Devices: Samsung S23 (Android 13), Pixel 6 (Android 12)
Payment: Stripe test mode (card: 4242 4242 4242 4242)
Database: Staging DB with anonymized production copy`
      },
      {
        heading: 'Test Data',
        content: `Test Users: 10 accounts pre-created (testuser01@qa.com ... testuser10@qa.com)
Products: 50 active products with varying stock levels
Addresses: US, UK, UAE delivery addresses pre-loaded
Payment cards: Stripe test cards for success, decline, and 3DS scenarios
Promo codes: SAVE10, FREESHIP, INVALID (for negative testing)`
      },
      {
        heading: 'Schedule & Milestones',
        content: `Week 1 (Jul 1-5):   Test case authoring + environment setup
Week 2 (Jul 8-12):  Smoke testing + functional testing
Week 3 (Jul 15-19): Regression + performance + security testing
Week 4 (Jul 22-25): UAT + defect retesting
Jul 28:             Exit criteria review + Go/No-Go meeting`
      },
    ]
  },
  {
    id: 'testcases',
    icon: TestTube,
    color: 'bg-orange-100 text-orange-700',
    title: 'Test Cases Example',
    subtitle: 'Login Module — 8 test cases',
    description: 'Well-structured test cases with preconditions, steps, expected results, and traceability.',
    sections: [
      {
        heading: 'TC-001: Successful login with valid credentials',
        content: `Priority: High | Type: Positive | Requirement: REQ-AUTH-001

Preconditions:
• User account exists with status Active
• App is on Login screen

Test Steps:
1. Enter valid username: "testuser01@qa.com"
2. Enter correct password: "Test@Pass123"
3. Tap "Sign In" button

Expected Result:
• Loading spinner shown for ≤2 seconds
• User redirected to Home screen
• Username displayed in top-right avatar
• Last login timestamp updated`
      },
      {
        heading: 'TC-002: Login with incorrect password',
        content: `Priority: High | Type: Negative | Requirement: REQ-AUTH-002

Preconditions:
• User account exists with status Active

Test Steps:
1. Enter valid username: "testuser01@qa.com"
2. Enter INCORRECT password: "wrongpassword"
3. Tap "Sign In" button

Expected Result:
• Error toast: "Invalid username or password"
• User remains on login screen
• Password field cleared
• Failed attempt counter incremented (check after 5 fails)`
      },
      {
        heading: 'TC-003: Account lockout after 5 failed attempts',
        content: `Priority: High | Type: Security | Requirement: REQ-SEC-007

Preconditions:
• Account has 4 failed attempts already

Test Steps:
1. Enter valid username, wrong password
2. Tap Sign In (5th failed attempt)

Expected Result:
• Account locked for 30 minutes
• Error: "Account locked. Try again in 30 minutes or reset password"
• Lock event logged in audit trail`
      },
      {
        heading: 'TC-004: Password field masking',
        content: `Priority: Medium | Type: Security | Requirement: REQ-SEC-003

Test Steps:
1. Navigate to Login screen
2. Tap Password field
3. Type any characters

Expected Result:
• Characters appear as dots (••••••)
• "Show password" eye icon visible
4. Tap eye icon — characters become visible
5. Tap again — characters masked again`
      },
    ]
  },
  {
    id: 'defects',
    icon: Bug,
    color: 'bg-red-100 text-red-700',
    title: 'Defect Report Example',
    subtitle: 'How to write a good bug report',
    description: 'A well-written defect report that developers can reproduce and fix quickly.',
    sections: [
      {
        heading: 'DEF-0142: Payment fails with 500 error on 3DS authentication',
        content: `Severity: Critical | Priority: P1
Reported by: James Patel | Date: 2026-06-30
Status: Open | Sprint: Sprint 4

Environment:
• Device: iPhone 14 Pro (iOS 17.4)
• App version: 2.0.0-beta.3
• Environment: Staging
• Network: WiFi

Steps to Reproduce:
1. Add any product to cart
2. Navigate to Checkout
3. Enter shipping address
4. Select Visa card requiring 3DS (test card: 4000002500003155)
5. Tap "Pay Now"
6. On 3DS popup, enter code "1234"
7. Tap Confirm

Actual Result:
• App shows spinner for 8 seconds
• Error toast: "Payment failed. Please try again"
• Console log: POST /api/v2/payments/confirm → 500 Internal Server Error
• Order NOT created in database

Expected Result:
• 3DS verification succeeds
• Order created with status "Payment Confirmed"
• User redirected to Order Confirmation screen

Evidence:
• Screenshot: 3DS_500_error.png (attached)
• HAR file: payment_request_log.har (attached)
• Crash log: crash_2026-06-30_14-32.txt (attached)

Root Cause (Dev note):
Webhook handler for 3DS callback not deployed to staging`
      },
    ]
  },
];

export default function ExamplesPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const copyContent = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Example Templates</h1>
        <p className="text-sm text-gray-500 mt-1">
          Learn how to prepare high-quality project documentation, test plans, test strategies, test cases, and defect reports.
          Click any card to expand the example.
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <BookOpen className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900">How to use these examples</p>
          <p className="text-xs text-blue-700 mt-0.5">
            Each example follows enterprise best practices. Copy any section directly into your test artifacts using the copy button, or use them as reference when using the AI Generator.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {EXAMPLES.map(ex => {
          const Icon = ex.icon;
          const isOpen = expanded[ex.id];
          const allContent = ex.sections.map(s => `## ${s.heading}\n\n${s.content}`).join('\n\n---\n\n');
          return (
            <div key={ex.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <button
                onClick={() => toggle(ex.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`h-10 w-10 rounded-xl ${ex.color} flex items-center justify-center shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{ex.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{ex.subtitle} &middot; {ex.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); copyContent(allContent, ex.id); }}
                    className="h-7 px-2.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-100 flex items-center gap-1"
                  >
                    {copied === ex.id ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied === ex.id ? 'Copied' : 'Copy All'}
                  </button>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
              </button>

              {/* Content */}
              {isOpen && (
                <div className="border-t border-gray-100 divide-y divide-gray-100">
                  {ex.sections.map((section, i) => (
                    <div key={i} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">{section.heading}</h4>
                        <button
                          onClick={() => copyContent(section.content, `${ex.id}-${i}`)}
                          className="h-6 px-2 rounded border border-gray-200 text-xs text-gray-400 hover:bg-gray-50 flex items-center gap-1"
                        >
                          {copied === `${ex.id}-${i}` ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                          Copy
                        </button>
                      </div>
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-lg px-4 py-3 overflow-x-auto">
                        {section.content}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Download tip */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
        <Download className="h-4 w-4 text-gray-400 shrink-0" />
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-gray-700">Pro tip:</span> Use these examples as prompts in the AI Assistant — paste the structure and say &quot;Generate a test strategy like this for my project: [project name].&quot;
        </p>
      </div>
    </div>
  );
}
