import Vue from 'vue';
export declare class FormBuilder extends Vue {
    builder?: any;
    builderReady?: Promise<any>;
    form?: any;
    options?: any;
    formChange(value: object): void;
    mounted(): void;
    destroyed(): void;
    initializeBuilder(): Promise<any>;
    render(createElement: any): any;
}
