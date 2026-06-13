export interface ClinicalDiagnosis {
  id: string;
  diagnosisId: string;
  icd10Code: string;
  icd10Description: string;
  lcdId: string;
  lcdTitle: string;
  lcdContractor: string;
  eligibilityCriteria: string[];
  clinicalDeclineIndicators: string[];
  stagingCriteria?: string;
  clinicalNote?: string;
  roleRelevance: {
    clinical_liaison: string;
    rn: string;
    social_worker: string;
  };
}

export interface HospiceMedication {
  id: string;
  name: string;
  rxcui: string;
  drugClass: string;
  clinicalPurpose: string;
  commonRoutes: string[];
  hospiceContext: string;
  rnEducationPoint: string;
  familyTeachingPoint: string;
  roleNote: string;
  scenarioRelevance: string[];
}

export interface LCDCriteria {
  id: string;
  displayId: string;
  title: string;
  contractor: string;
  effectiveDate: string;
  diagnosisCategories: string[];
  generalCriteria: string[];
  specificCriteria: string[];
  clinicalNote: string;
}

export interface EvidenceStatement {
  id: string;
  scenarioId: string;
  skillCategory: string;
  headline: string;
  statement: string;
  clinicalContext: string;
  citation: string;
  pmid?: string;
}
