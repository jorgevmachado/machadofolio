export type EnsureColorResult = {
    text_color: string;
    background_color: string;
}

export type EnsureColorParams = Partial<EnsureColorResult> & {
    name: string;
}

export type TypeColor =  EnsureColorResult & {
    id: number;
    name: string;
}