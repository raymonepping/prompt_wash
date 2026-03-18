export interface ExperimentsListData {
  experiments: string[];
}

export interface ExperimentRecord {
  [key: string]: unknown;
}

export interface ExperimentDetailData {
  experiment: ExperimentRecord;
}

export interface RunExperimentRequest {
  prompt: string;
  variants: string[];
  model?: string | null;
}

export interface RunExperimentData {
  message: string;
  input: {
    prompt: string;
    variants: string[];
    model: string | null;
  };
}
