export interface ICountry {
    id: number;
    name: string;
}

export interface IRegion extends ICountry {
    idCountry: number;
}

export interface ICity extends IRegion {
    idRegion: number;
}
