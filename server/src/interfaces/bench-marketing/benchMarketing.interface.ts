export interface BenchmarkData {
    source: string;
    range: string;
    url: string;
}

export interface BenchmarkResponse {
    benchmarks: BenchmarkData[];
}

export interface AnalysisResponse {
    analysis: string;
}