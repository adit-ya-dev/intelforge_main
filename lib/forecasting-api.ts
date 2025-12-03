// Utility functions for Forecasting API calls with better error handling

export async function fetchModels(filters?: {
  type?: string;
  status?: string;
  tags?: string;
  page?: number;
  pageSize?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.type) params.append("type", filters.type);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.tags) params.append("tags", filters.tags);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.pageSize) params.append("pageSize", filters.pageSize.toString());

  try {
    const response = await fetch(`/api/forecasting/models?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || "Failed to fetch models");
    }
    
    return response.json();
  } catch (error: any) {
    console.error("Error fetching models:", error);
    throw error;
  }
}

export async function fetchModelDetail(modelId: string) {
  try {
    const response = await fetch(`/api/forecasting/models/${modelId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || "Failed to fetch model detail");
    }
    
    return response.json();
  } catch (error: any) {
    console.error("Error fetching model detail:", error);
    throw error;
  }
}

export async function fetchScenarioPresets(publicOnly = true) {
  const params = new URLSearchParams();
  if (publicOnly) params.append("public", "true");

  try {
    const response = await fetch(`/api/forecasting/scenarios?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || "Failed to fetch scenario presets");
    }
    
    return response.json();
  } catch (error: any) {
    console.error("Error fetching presets:", error);
    throw error;
  }
}

export async function seedDatabase() {
  try {
    const response = await fetch("/api/forecasting/seed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || "Failed to seed database");
    }

    return response.json();
  } catch (error: any) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

export async function createForecastJob(data: {
  modelId: string;
  techIds: string[];
  scenario: string;
  parameters: any;
  createdBy?: string;
  randomSeed?: number;
  comments?: string;
  assumptions?: string[];
}) {
  try {
    const response = await fetch("/api/forecasting/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || "Failed to create forecast job");
    }
    
    return response.json();
  } catch (error: any) {
    console.error("Error creating job:", error);
    throw error;
  }
}

export async function fetchJobStatus(jobId: string) {
  const params = new URLSearchParams();
  params.append("jobId", jobId);

  try {
    const response = await fetch(`/api/forecasting/jobs?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || "Failed to fetch job status");
    }
    
    return response.json();
  } catch (error: any) {
    console.error("Error fetching job status:", error);
    throw error;
  }
}

export async function fetchJobResults(jobId: string) {
  const params = new URLSearchParams();
  params.append("jobId", jobId);

  try {
    const response = await fetch(`/api/forecasting/results?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || "Failed to fetch job results");
    }
    
    return response.json();
  } catch (error: any) {
    console.error("Error fetching results:", error);
    throw error;
  }
}

export async function fetchScheduledRuns(activeOnly = false) {
  const params = new URLSearchParams();
  if (activeOnly) params.append("active", "true");

  try {
    const response = await fetch(`/api/forecasting/scheduled?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || "Failed to fetch scheduled runs");
    }
    
    return response.json();
  } catch (error: any) {
    console.error("Error fetching scheduled runs:", error);
    throw error;
  }
}

export async function createScheduledRun(data: {
  name: string;
  modelId: string;
  techIds: string[];
  scenario: string;
  parameters: any;
  schedule: any;
  notifications?: any;
  createdBy?: string;
}) {
  try {
    const response = await fetch("/api/forecasting/scheduled", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || "Failed to create scheduled run");
    }
    
    return response.json();
  } catch (error: any) {
    console.error("Error creating scheduled run:", error);
    throw error;
  }
}

export async function updateModel(modelId: string, data: any) {
  try {
    const response = await fetch(`/api/forecasting/models/${modelId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || "Failed to update model");
    }
    
    return response.json();
  } catch (error: any) {
    console.error("Error updating model:", error);
    throw error;
  }
}

export async function incrementModelUsage(modelId: string) {
  try {
    const modelDetail = await fetchModelDetail(modelId);
    const currentUsage = modelDetail.model.usage_count || 0;
    
    return updateModel(modelId, {
      usage_count: currentUsage + 1,
    });
  } catch (error: any) {
    console.error("Error incrementing model usage:", error);
    // Don't throw - this is non-critical
    return null;
  }
}