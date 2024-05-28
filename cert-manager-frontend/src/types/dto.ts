export interface CertificateDTO {
    id: string;
    name: string;
    state: CertificateState;
    csr: string;
    value: string;
    rootCA: string;
    chain: string[];
    serialNumber: string;
    sha1Fingerprint: string;
    sha256Fingerprint: string;
    validFrom: Date;
    validUntil: Date;
    subject: DistinguishedName;
    issuer: DistinguishedName;
    subjectAlternativeNames: SubjectAlternativeName[];
    key: Key;
    certificateAuthority: boolean;
    awsDeployments: AwsDeployment[];
}

export enum CertificateState {
    CREATION="CREATION",
    DISTRIBUTION="DISTRIBUTION",
    RENEWAL="RENEWAL",
    REVOCATION="REVOCATION"
}

export interface DistinguishedName {
    commonName: string;
    organization: string;
    organizationUnit: string;
    locality: string;
    state: string;
    country: string;
}

export interface SubjectAlternativeName {
    type: string;
    value: string;
}

export interface Key {
    size: number;
    algorithm: Algorithm;
    secretEngine: SecretEngine;
    modulus: string;
}

export enum Algorithm {
    RSA="RSA"
}

export enum SecretEngine {
    JAVA="JAVA"
}

export interface AwsDeployment {
    execution: Date;
    certificateArn: string;
}

export interface KeystoreDTO {
    id: string;
    name: string;
    description: string;
    entries: KeystoreEntryDTO[];
}

export interface KeystoreEntryDTO {
    alias: string;
    type: KeystoreEntryType;
    certificate: CertificateDTO;
    includeRootCA: boolean;
}

export enum KeystoreEntryType {
    TRUSTED_CERTIFICATE="TRUSTED_CERTIFICATE",
    ASYMMETRIC_KEY="ASYMMETRIC_KEY"
}

export enum KeystoreType {
    PKCS12="PKCS12",
    JKS="JKS"
}