/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KCallableObject } from './KCallableObject';
import type { KClassObject } from './KClassObject';
import type { KFunctionPhotographyRequest } from './KFunctionPhotographyRequest';
import type { KType } from './KType';
import type { KTypeParameter } from './KTypeParameter';
import type { PhotographyRequest } from './PhotographyRequest';
export type KClassPhotographyRequest = {
    visibility?: KClassPhotographyRequest.visibility;
    isFun: boolean;
    sealedSubclasses: Array<KClassPhotographyRequest>;
    isInner: boolean;
    isCompanion: boolean;
    isValue: boolean;
    qualifiedName?: string;
    members: Array<KCallableObject>;
    nestedClasses: Array<KClassObject>;
    objectInstance?: PhotographyRequest;
    supertypes: Array<KType>;
    isData: boolean;
    typeParameters: Array<KTypeParameter>;
    simpleName?: string;
    isFinal: boolean;
    isOpen: boolean;
    constructors: Array<KFunctionPhotographyRequest>;
    isSealed: boolean;
    isAbstract: boolean;
    annotations: Array<any>;
};
export namespace KClassPhotographyRequest {
    export enum visibility {
        PUBLIC = 'PUBLIC',
        PROTECTED = 'PROTECTED',
        INTERNAL = 'INTERNAL',
        PRIVATE = 'PRIVATE',
    }
}

