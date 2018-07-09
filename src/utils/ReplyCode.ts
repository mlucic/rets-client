/**
 * Tags & Constant representation for reply codes
 *
 * Authoritative documentation for all reply codes in current rets standard:
 * http://www.reso.org/assets/RETS/Specifications/rets_1_8.pdf
 */

export const ReplyCode: { [key: string]: number | number[] } = {
    OperationSuccessful: 0,
    SystemError: 10000,
    ZeroBalance: 20003,
    BrokerCodeRequired: 20012,
    BrokerCodeInvalid: 20013,
    AdditionalLoginNotPermitted: 20022,
    MiscellaneousServerLoginError: 20036,
    ClientAuthenticationFailed: 20037,
    UserAgentAuthenticationRequired: 20041,
    ServerTemporarilyDisabled: 20050,
    InsecurePassword: 20140,
    SameAsPreviousPassword: 20141,
    TheEncryptedUserNameWasInvalid: 20142,
    UnknownQueryField: 20200,
    NoRecordsFound: 20201,
    InvalidSelect: 20202,
    MiscellaneousSearchError: 20203,
    InvalidQuerySyntax: 20206,
    UnauthorizedQuery: 20207,
    MaximumRecordsExceeded: 20208,
    Timeout: [20209, 20411, 20511, 20811],
    TooManyOutstandingQueries: [20210, 20412, 20512, 20812],
    QueryTooComplex: 20211,
    InvalidKeyRequest: 20212,
    InvalidKey: 20213,
    InvalidParameter: 20301,
    UnableToSaveRecordOnServer: 20302,
    MiscellaneousUpdateError: 20303,
    WarningResponseNotGiven: 20311,
    WarningResponseGiven: 20312,
    InvalidResource: [20400, 20500],
    InvalidType: [20401, 20501],
    InvalidIdentifier: [20402, 20502, 20802],
    NoObjectFound: 20403,
    UnsupportedMimeType: [20406, 20506, 20806],
    UnauthorizedRetrieval: [20407, 20507],
    ResourceUnavailable: [20408, 20508],
    ObjectUnavailable: 20409,
    RequestTooLatge: [20410, 20510],
    MiscellaneousError: [20413, 20513, 20702, 20813],
    NoMetadataFound: 20503,
    MetadataUnavailable: 20509,
    RequestedDTDVersionUnavailable: 20514,
    NotLoggedIn: 20701,
    UnknownResource: 20800,
    InvalidObjectType: 20801,
    InvalidUpdateAction: 20803,
    InconsistentRequestParameters: 20804,
    NoObjectFoundForDelete: 20805,
    Unauthorized: 20807,
    SomeObjectsNotDeleted: 20808,
    ObjectNotMeetBusinessRules: 20809,
    FileSizeTooLarge: 20810
};

const codeKeys = Object.keys(ReplyCode);

export function findReplyCodeName(code: number): string | undefined {
    for (let i = -1; ++i < codeKeys.length;) {
        const targetCode = ReplyCode[codeKeys[i]];
        if (typeof targetCode === 'number' && targetCode === code) {
            return codeKeys[i];
        } else if (targetCode instanceof Array && targetCode.includes(code)) {
            return codeKeys[i];
        }
    }
}
