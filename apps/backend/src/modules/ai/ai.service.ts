import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({ apiKey: this.config.get('OPENAI_API_KEY') });
  }

  private async chat(systemPrompt: string, userPrompt: string, model = 'gpt-4o'): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });
    return response.choices[0].message.content || '';
  }

  async generateTestStrategy(projectData: any, requirements: string[]): Promise<string> {
    const system = `You are a Senior Test Manager with 20+ years of experience in enterprise software testing, particularly in telecom, billing, and network systems.
You produce professional, comprehensive test strategy documents following IEEE 829 and ISO 29119 standards.
Always include: Document Control, Version History, Introduction, Test Scope, Test Approach, Testing Levels, Testing Types, Entry/Exit Criteria, Defect Management, Risk Management, Resource Plan, Environment Requirements, Test Data Strategy, Automation Strategy, Reporting Strategy, Communication Plan, Deliverables, Schedule, Dependencies, Assumptions, Constraints, Approval sections.
Format in clean Markdown with proper headings, tables, and bullet points.`;

    const user = `Generate a complete enterprise Test Strategy document for the following project:

Project Name: ${projectData.name}
Description: ${projectData.description}
Project Type: ${projectData.type}
Phase: ${projectData.phase}
Start Date: ${projectData.startDate}
End Date: ${projectData.endDate}
Test Manager: ${projectData.owner}
Team Size: ${projectData.team}
Environments: ${projectData.environments?.join(', ')}

Requirements Overview:
${requirements.join('\n')}

Generate a complete, professional Test Strategy document ready for enterprise use.`;

    return this.chat(system, user);
  }

  async generateTestPlan(projectData: any, strategyHighlights: string): Promise<string> {
    const system = `You are a Senior Test Manager. Generate a detailed, professional Test Plan document that drills down from the Test Strategy into specific test planning details.
Include: Introduction, Objectives, Scope, Test Environment, Test Data, Entry/Exit Criteria, Deliverables, Resources, Roles & Responsibilities, Schedule & Milestones, Risks & Mitigations, Dependencies, Communication Plan, Defect Management, Tools, Reporting, Approvals.`;

    const user = `Generate a detailed Test Plan for:
Project: ${projectData.name}
Strategy Highlights: ${strategyHighlights}
Provide specific milestones, schedule, resource assignments, and detailed test execution plan.`;

    return this.chat(system, user);
  }

  async generateTestCases(source: string, sourceType: string, testTypes: string[], context?: string): Promise<any[]> {
    const system = `You are a Senior Test Engineer. Generate comprehensive, professional test cases from the provided source.
For each test case provide: id, title, description, priority (Critical/High/Medium/Low), type, preconditions, testData (array of strings), steps (array of objects with stepNumber, action, expectedResult), expectedResult, actualResult (empty string), status (Not Run), automationFlag (boolean), riskLevel (High/Medium/Low), estimatedDuration (minutes).
Always cover: positive, negative, boundary, security, and performance scenarios as requested.
Return a valid JSON array of test case objects.`;

    const user = `Generate comprehensive test cases from this ${sourceType}:

${source}

Test Types to Generate: ${testTypes.join(', ')}
Additional Context: ${context || 'Enterprise telecom environment'}

Return ONLY a valid JSON array. Each test case must be detailed enough to execute without ambiguity.`;

    const response = await this.chat(system, user);
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return JSON.parse(response);
    } catch {
      this.logger.error('Failed to parse AI test case response');
      return [];
    }
  }

  async analyzeRequirementGaps(requirements: string[]): Promise<any> {
    const system = `You are a Senior Test Manager and Business Analyst. Perform a thorough requirement gap analysis.
Identify: missing requirements, conflicting requirements, missing acceptance criteria, missing business rules, missing integrations, missing negative scenarios, missing boundary conditions, performance risks, security risks, compliance risks, accessibility gaps, clarification questions.
Return structured JSON with categories, severity (Critical/High/Medium/Low), count, and items for each category.`;

    const user = `Analyze the following requirements for gaps:

${requirements.join('\n')}

Return a JSON object with gap categories as keys, each containing: severity, count, items (array), recommendations (array).`;

    const response = await this.chat(system, user);
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return { error: 'Could not parse response' };
    } catch {
      return { rawResponse: response };
    }
  }

  async analyzeRootCause(defectData: any, logs?: string): Promise<any> {
    const system = `You are a Senior Test Engineer and debugging expert. Analyze defect information and logs to identify root cause, suggest probable fixes, and recommend additional test cases.
Return JSON: { rootCause, probability, evidence, suggestedFix, preventiveMeasures, additionalTests, affectedComponents, estimatedFixTime }.`;

    const user = `Analyze this defect:
Title: ${defectData.title}
Description: ${defectData.description}
Steps to Reproduce: ${defectData.steps}
Expected: ${defectData.expected}
Actual: ${defectData.actual}
Environment: ${defectData.environment}
${logs ? `\nLogs:\n${logs}` : ''}`;

    const response = await this.chat(system, user);
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return { rootCause: response, suggestedFix: 'See details above' };
    } catch {
      return { rootCause: response };
    }
  }

  async analyzeLogs(logs: string, logType: string): Promise<any> {
    const system = `You are a network and application debugging expert specializing in telecom systems.
Analyze logs to: identify failures, find root causes, detect patterns, correlate failures, suggest fixes, recommend additional tests.
Return JSON: { summary, failures (array), patterns (array), rootCauses (array), recommendations (array), additionalTests (array) }.`;

    const user = `Analyze these ${logType} logs and identify failures, patterns, and root causes:

${logs.substring(0, 8000)}`;

    const response = await this.chat(system, user);
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return { summary: response };
    } catch {
      return { summary: response };
    }
  }

  async generateEmail(type: string, data: any): Promise<string> {
    const system = `You are a Senior Test Manager writing professional test completion emails.
Write formal, professional emails with: clear subject line, executive summary, execution statistics table, pass%, fail%, blocked, known issues, risks, recommendations, professional sign-off.
Use HTML table formatting for statistics.`;

    const emailTypes: Record<string, string> = {
      cr: 'CR Testing Completion',
      pvt: 'Production Verification Testing (PVT)',
      uat: 'UAT Completion',
      regression: 'Regression Test Completion',
      release: 'Release Readiness',
      defect_summary: 'Defect Summary',
      risk_escalation: 'Risk Escalation',
    };

    const user = `Write a professional ${emailTypes[type] || type} email with:
Project: ${data.projectName}
Test Cycle: ${data.cycleName}
Total Test Cases: ${data.total}
Passed: ${data.passed} (${Math.round(data.passed/data.total*100)}%)
Failed: ${data.failed} (${Math.round(data.failed/data.total*100)}%)
Blocked: ${data.blocked}
Critical Defects: ${data.criticalDefects}
Open Defects: ${data.openDefects}
Environment: ${data.environment}
Test Manager: ${data.testManager}
Date: ${data.date}
Known Issues: ${data.knownIssues || 'None'}
Risks: ${data.risks || 'None identified'}`;

    return this.chat(system, user);
  }

  async generateReport(type: string, data: any): Promise<string> {
    const system = `You are a Senior Test Manager. Generate professional, detailed testing reports.
Include executive summary, detailed findings, metrics, trends, risks, and recommendations.
Format in Markdown with tables, metrics, and clear sections.`;

    const reportTypes: Record<string, string> = {
      daily: 'Daily Test Status Report',
      weekly: 'Weekly Test Progress Report',
      release: 'Release Readiness Assessment',
      execution: 'Test Execution Summary Report',
      defect: 'Defect Analysis Report',
      coverage: 'Test Coverage Report',
    };

    const user = `Generate a ${reportTypes[type] || type} for:
Project: ${data.projectName}
Period: ${data.period}
Data: ${JSON.stringify(data.metrics, null, 2)}`;

    return this.chat(system, user);
  }

  async chatWithAssistant(messages: Array<{ role: string; content: string }>, context: any): Promise<string> {
    const systemContent = `You are an AI-powered Senior Test Manager assistant for an enterprise Test Management Platform.
You have deep expertise in: software testing methodologies, telecom testing (5G, VoLTE, IMS, HSS), test automation, defect management, performance testing, security testing, UAT, and PVT.
Current project context: ${JSON.stringify(context, null, 2)}
Always provide actionable, specific answers. When generating documents, be thorough. When analyzing issues, be precise.
Never say "I cannot help with that" — find a way to assist.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemContent },
        ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      ],
      temperature: 0.4,
      max_tokens: 3000,
    });
    return response.choices[0].message.content || '';
  }

  async performRegressionImpactAnalysis(changedComponents: string[], requirements: any[], testCases: any[]): Promise<any> {
    const system = `You are a Senior Test Manager. Analyze regression impact of component changes.
Return JSON: { impactedSystems, impactedAPIs, impactedTestCases (array of IDs), recommendedRegression, automationCandidates, riskScore (0-10), estimatedEffort (hours), priority }.`;

    const user = `Analyze regression impact for these changes:
Changed Components: ${changedComponents.join(', ')}
Available Requirements: ${JSON.stringify(requirements.slice(0, 20))}
Available Test Cases: ${JSON.stringify(testCases.slice(0, 50))}`;

    const response = await this.chat(system, user);
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return { analysis: response };
    } catch {
      return { analysis: response };
    }
  }
}
