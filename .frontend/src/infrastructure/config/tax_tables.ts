export interface TaxBracket {
    threshold: number; // UVT floor for this bracket
    rate: number; // Marginal rate (0.19, 0.28, etc.)
    addedBaseUVT: number; // Fixed UVT added (e.g., 10, 69)
    subtractUVT: number; // UVT subtracted from base (usually equal to threshold)
}

export type TaxTable = TaxBracket[];

export const TAX_TABLES: Record<string, TaxTable> = {
    actual: [
        { threshold: 2300, rate: 0.39, addedBaseUVT: 770, subtractUVT: 2300 },
        { threshold: 945, rate: 0.37, addedBaseUVT: 268, subtractUVT: 945 },
        { threshold: 640, rate: 0.35, addedBaseUVT: 162, subtractUVT: 640 },
        { threshold: 360, rate: 0.33, addedBaseUVT: 69, subtractUVT: 360 },
        { threshold: 150, rate: 0.28, addedBaseUVT: 10, subtractUVT: 150 },
        { threshold: 95, rate: 0.19, addedBaseUVT: 0, subtractUVT: 95 },
    ],
    legacy_user_85uvt: [
        { threshold: 2300, rate: 0.39, addedBaseUVT: 770, subtractUVT: 2300 },
        { threshold: 1140, rate: 0.37, addedBaseUVT: 341, subtractUVT: 1140 },
        { threshold: 640, rate: 0.35, addedBaseUVT: 166, subtractUVT: 640 },
        { threshold: 350, rate: 0.33, addedBaseUVT: 70, subtractUVT: 350 },
        { threshold: 140, rate: 0.28, addedBaseUVT: 11, subtractUVT: 140 },
        { threshold: 85, rate: 0.19, addedBaseUVT: 0, subtractUVT: 85 },
    ],
    legacy_2019_2022: [
        { threshold: 2300, rate: 0.39, addedBaseUVT: 770, subtractUVT: 2300 },
        { threshold: 945, rate: 0.37, addedBaseUVT: 268, subtractUVT: 945 },
        { threshold: 640, rate: 0.35, addedBaseUVT: 162, subtractUVT: 640 },
        { threshold: 360, rate: 0.33, addedBaseUVT: 69, subtractUVT: 360 },
        { threshold: 150, rate: 0.28, addedBaseUVT: 10, subtractUVT: 150 },
        { threshold: 87, rate: 0.19, addedBaseUVT: 0, subtractUVT: 87 },
    ],
    legacy_2017_2018: [
        { threshold: 360, rate: 0.33, addedBaseUVT: 69, subtractUVT: 360 },
        { threshold: 150, rate: 0.28, addedBaseUVT: 10, subtractUVT: 150 },
        { threshold: 95, rate: 0.19, addedBaseUVT: 0, subtractUVT: 95 },
    ],
    legacy_2013_2016: [
        { threshold: 360, rate: 0.33, addedBaseUVT: 69, subtractUVT: 360 },
        { threshold: 150, rate: 0.28, addedBaseUVT: 10, subtractUVT: 150 },
        { threshold: 95, rate: 0.19, addedBaseUVT: 0, subtractUVT: 95 },
    ],
    legacy_2010_2012: [
        { threshold: 360, rate: 0.33, addedBaseUVT: 69, subtractUVT: 360 },
        { threshold: 150, rate: 0.28, addedBaseUVT: 10, subtractUVT: 150 },
        { threshold: 95, rate: 0.19, addedBaseUVT: 0, subtractUVT: 95 },
    ],
};
