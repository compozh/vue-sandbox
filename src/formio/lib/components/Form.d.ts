import Vue from 'vue';
export declare class Form extends Vue {
    formio?: any;
    src?: string;
    url?: string;
    form?: object;
    submission?: object;
    language?: string;
    options?: object;
    srcChange(value: string): void;
    urlChange(value: string): void;
    formChange(value: object): void;
    submissionhange(value: object): void;
    languageChange(value: string): void;
    mounted(): void;
    destroyed(): void;
    initializeForm(): Promise<any>;
    setupForm(): void;
    render(createElement: any): any;
}
