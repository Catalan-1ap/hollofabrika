import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql";


export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AccountNumber: any;
  BigInt: any;
  Byte: any;
  CountryCode: any;
  Cuid: any;
  Currency: any;
  DID: any;
  Date: any;
  DateTime: any;
  DateTimeISO: any;
  DeweyDecimal: any;
  Duration: any;
  EmailAddress: any;
  GUID: any;
  HSL: any;
  HSLA: any;
  HexColorCode: any;
  Hexadecimal: any;
  IBAN: any;
  IP: any;
  IPCPatent: any;
  IPv4: any;
  IPv6: any;
  ISBN: any;
  ISO8601Duration: any;
  JSON: any;
  JSONObject: Record<string, string>;
  JWT: any;
  LCCSubclass: any;
  Latitude: any;
  LocalDate: any;
  LocalDateTime: any;
  LocalEndTime: any;
  LocalTime: any;
  Locale: any;
  Long: any;
  Longitude: any;
  MAC: any;
  NegativeFloat: any;
  NegativeInt: any;
  NonEmptyString: any;
  NonNegativeFloat: any;
  NonNegativeInt: any;
  NonPositiveFloat: any;
  NonPositiveInt: any;
  ObjectID: any;
  PhoneNumber: any;
  Port: any;
  PositiveFloat: any;
  PositiveInt: any;
  PostalCode: any;
  RGB: any;
  RGBA: any;
  RoutingNumber: any;
  SafeInt: any;
  SemVer: any;
  Time: any;
  TimeZone: any;
  Timestamp: any;
  URL: any;
  USCurrency: any;
  UUID: any;
  UnsignedFloat: any;
  UnsignedInt: any;
  UtcOffset: any;
  Void: any;
};

export type GqlCategory = {
  attributes: Scalars["JSONObject"];
  name: Scalars["String"];
};

export type GqlCreateCategoryArgs = {
  attributes: Scalars["JSONObject"];
  name: Scalars["String"];
};

export type GqlError = {
  code?: Maybe<GqlErrorCode>;
  message: Scalars["String"];
};

export enum GqlErrorCode {
  BadRequest = "BadRequest",
  InternalError = "InternalError"
}

export type GqlJwtToken = {
  access: Scalars['String'];
  refresh: Scalars['String'];
};

export type GqlMutation = {
  createCategory: GqlCategory;
  login?: Maybe<GqlJwtToken>;
  refresh?: Maybe<GqlJwtToken>;
  register?: Maybe<GqlRegisterResponse>;
  verifyEmail?: Maybe<GqlSuccess>;
};


export type GqlMutationCreateCategoryArgs = {
  category: GqlCreateCategoryArgs;
};


export type GqlMutationLoginArgs = {
  password: Scalars["String"];
  username: Scalars["String"];
};


export type GqlMutationRefreshArgs = {
  token: Scalars["String"];
};


export type GqlMutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type GqlMutationVerifyEmailArgs = {
  confirmToken: Scalars['String'];
  emailToken: Scalars['Int'];
};

export type GqlQuery = {
  categories: Array<GqlCategory>;
  currentUser: GqlUser;
};

export type GqlRegisterResponse = {
  confirmToken?: Maybe<Scalars['String']>;
};

export enum GqlRole {
  Admin = 'Admin',
  Standalone = 'Standalone'
}

export type GqlSomethingWentWrong = {
  errors: Array<GqlError>;
};

export type GqlSuccess = {
  code?: Maybe<GqlSuccessCode>;
};

export enum GqlSuccessCode {
  ConfirmAction = 'ConfirmAction',
  Oke = 'Oke'
}

export type GqlUser = {
  email: Scalars['String'];
  role: GqlRole;
  username: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type GqlResolversTypes = {
  AccountNumber: ResolverTypeWrapper<Scalars["AccountNumber"]>;
  BigInt: ResolverTypeWrapper<Scalars["BigInt"]>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Byte: ResolverTypeWrapper<Scalars["Byte"]>;
  Category: ResolverTypeWrapper<GqlCategory>;
  CountryCode: ResolverTypeWrapper<Scalars["CountryCode"]>;
  CreateCategoryArgs: GqlCreateCategoryArgs;
  Cuid: ResolverTypeWrapper<Scalars["Cuid"]>;
  Currency: ResolverTypeWrapper<Scalars["Currency"]>;
  DID: ResolverTypeWrapper<Scalars["DID"]>;
  Date: ResolverTypeWrapper<Scalars["Date"]>;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]>;
  DateTimeISO: ResolverTypeWrapper<Scalars["DateTimeISO"]>;
  DeweyDecimal: ResolverTypeWrapper<Scalars["DeweyDecimal"]>;
  Duration: ResolverTypeWrapper<Scalars["Duration"]>;
  EmailAddress: ResolverTypeWrapper<Scalars["EmailAddress"]>;
  Error: ResolverTypeWrapper<GqlError>;
  ErrorCode: GqlErrorCode;
  GUID: ResolverTypeWrapper<Scalars["GUID"]>;
  HSL: ResolverTypeWrapper<Scalars["HSL"]>;
  HSLA: ResolverTypeWrapper<Scalars["HSLA"]>;
  HexColorCode: ResolverTypeWrapper<Scalars["HexColorCode"]>;
  Hexadecimal: ResolverTypeWrapper<Scalars["Hexadecimal"]>;
  IBAN: ResolverTypeWrapper<Scalars["IBAN"]>;
  IP: ResolverTypeWrapper<Scalars["IP"]>;
  IPCPatent: ResolverTypeWrapper<Scalars["IPCPatent"]>;
  IPv4: ResolverTypeWrapper<Scalars["IPv4"]>;
  IPv6: ResolverTypeWrapper<Scalars["IPv6"]>;
  ISBN: ResolverTypeWrapper<Scalars["ISBN"]>;
  ISO8601Duration: ResolverTypeWrapper<Scalars["ISO8601Duration"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  JSON: ResolverTypeWrapper<Scalars["JSON"]>;
  JSONObject: ResolverTypeWrapper<Scalars["JSONObject"]>;
  JWT: ResolverTypeWrapper<Scalars["JWT"]>;
  JwtToken: ResolverTypeWrapper<GqlJwtToken>;
  LCCSubclass: ResolverTypeWrapper<Scalars["LCCSubclass"]>;
  Latitude: ResolverTypeWrapper<Scalars["Latitude"]>;
  LocalDate: ResolverTypeWrapper<Scalars["LocalDate"]>;
  LocalDateTime: ResolverTypeWrapper<Scalars["LocalDateTime"]>;
  LocalEndTime: ResolverTypeWrapper<Scalars["LocalEndTime"]>;
  LocalTime: ResolverTypeWrapper<Scalars["LocalTime"]>;
  Locale: ResolverTypeWrapper<Scalars["Locale"]>;
  Long: ResolverTypeWrapper<Scalars["Long"]>;
  Longitude: ResolverTypeWrapper<Scalars["Longitude"]>;
  MAC: ResolverTypeWrapper<Scalars["MAC"]>;
  Mutation: ResolverTypeWrapper<{}>;
  NegativeFloat: ResolverTypeWrapper<Scalars["NegativeFloat"]>;
  NegativeInt: ResolverTypeWrapper<Scalars["NegativeInt"]>;
  NonEmptyString: ResolverTypeWrapper<Scalars["NonEmptyString"]>;
  NonNegativeFloat: ResolverTypeWrapper<Scalars["NonNegativeFloat"]>;
  NonNegativeInt: ResolverTypeWrapper<Scalars["NonNegativeInt"]>;
  NonPositiveFloat: ResolverTypeWrapper<Scalars["NonPositiveFloat"]>;
  NonPositiveInt: ResolverTypeWrapper<Scalars["NonPositiveInt"]>;
  ObjectID: ResolverTypeWrapper<Scalars["ObjectID"]>;
  PhoneNumber: ResolverTypeWrapper<Scalars["PhoneNumber"]>;
  Port: ResolverTypeWrapper<Scalars["Port"]>;
  PositiveFloat: ResolverTypeWrapper<Scalars["PositiveFloat"]>;
  PositiveInt: ResolverTypeWrapper<Scalars["PositiveInt"]>;
  PostalCode: ResolverTypeWrapper<Scalars["PostalCode"]>;
  Query: ResolverTypeWrapper<{}>;
  RGB: ResolverTypeWrapper<Scalars["RGB"]>;
  RGBA: ResolverTypeWrapper<Scalars["RGBA"]>;
  RegisterResponse: ResolverTypeWrapper<GqlRegisterResponse>;
  Role: GqlRole;
  RoutingNumber: ResolverTypeWrapper<Scalars["RoutingNumber"]>;
  SafeInt: ResolverTypeWrapper<Scalars["SafeInt"]>;
  SemVer: ResolverTypeWrapper<Scalars["SemVer"]>;
  SomethingWentWrong: ResolverTypeWrapper<GqlSomethingWentWrong>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Success: ResolverTypeWrapper<GqlSuccess>;
  SuccessCode: GqlSuccessCode;
  Time: ResolverTypeWrapper<Scalars["Time"]>;
  TimeZone: ResolverTypeWrapper<Scalars["TimeZone"]>;
  Timestamp: ResolverTypeWrapper<Scalars["Timestamp"]>;
  URL: ResolverTypeWrapper<Scalars["URL"]>;
  USCurrency: ResolverTypeWrapper<Scalars["USCurrency"]>;
  UUID: ResolverTypeWrapper<Scalars["UUID"]>;
  UnsignedFloat: ResolverTypeWrapper<Scalars["UnsignedFloat"]>;
  UnsignedInt: ResolverTypeWrapper<Scalars["UnsignedInt"]>;
  User: ResolverTypeWrapper<GqlUser>;
  UtcOffset: ResolverTypeWrapper<Scalars["UtcOffset"]>;
  Void: ResolverTypeWrapper<Scalars["Void"]>;
};

/** Mapping between all available schema types and the resolvers parents */
export type GqlResolversParentTypes = {
  AccountNumber: Scalars["AccountNumber"];
  BigInt: Scalars["BigInt"];
  Boolean: Scalars["Boolean"];
  Byte: Scalars["Byte"];
  Category: GqlCategory;
  CountryCode: Scalars["CountryCode"];
  CreateCategoryArgs: GqlCreateCategoryArgs;
  Cuid: Scalars["Cuid"];
  Currency: Scalars["Currency"];
  DID: Scalars["DID"];
  Date: Scalars["Date"];
  DateTime: Scalars["DateTime"];
  DateTimeISO: Scalars["DateTimeISO"];
  DeweyDecimal: Scalars["DeweyDecimal"];
  Duration: Scalars["Duration"];
  EmailAddress: Scalars["EmailAddress"];
  Error: GqlError;
  GUID: Scalars["GUID"];
  HSL: Scalars["HSL"];
  HSLA: Scalars["HSLA"];
  HexColorCode: Scalars["HexColorCode"];
  Hexadecimal: Scalars["Hexadecimal"];
  IBAN: Scalars["IBAN"];
  IP: Scalars["IP"];
  IPCPatent: Scalars["IPCPatent"];
  IPv4: Scalars["IPv4"];
  IPv6: Scalars["IPv6"];
  ISBN: Scalars["ISBN"];
  ISO8601Duration: Scalars["ISO8601Duration"];
  Int: Scalars["Int"];
  JSON: Scalars["JSON"];
  JSONObject: Scalars["JSONObject"];
  JWT: Scalars["JWT"];
  JwtToken: GqlJwtToken;
  LCCSubclass: Scalars["LCCSubclass"];
  Latitude: Scalars["Latitude"];
  LocalDate: Scalars["LocalDate"];
  LocalDateTime: Scalars["LocalDateTime"];
  LocalEndTime: Scalars["LocalEndTime"];
  LocalTime: Scalars["LocalTime"];
  Locale: Scalars["Locale"];
  Long: Scalars["Long"];
  Longitude: Scalars["Longitude"];
  MAC: Scalars["MAC"];
  Mutation: {};
  NegativeFloat: Scalars["NegativeFloat"];
  NegativeInt: Scalars["NegativeInt"];
  NonEmptyString: Scalars["NonEmptyString"];
  NonNegativeFloat: Scalars["NonNegativeFloat"];
  NonNegativeInt: Scalars["NonNegativeInt"];
  NonPositiveFloat: Scalars["NonPositiveFloat"];
  NonPositiveInt: Scalars["NonPositiveInt"];
  ObjectID: Scalars["ObjectID"];
  PhoneNumber: Scalars["PhoneNumber"];
  Port: Scalars["Port"];
  PositiveFloat: Scalars["PositiveFloat"];
  PositiveInt: Scalars["PositiveInt"];
  PostalCode: Scalars["PostalCode"];
  Query: {};
  RGB: Scalars["RGB"];
  RGBA: Scalars["RGBA"];
  RegisterResponse: GqlRegisterResponse;
  RoutingNumber: Scalars["RoutingNumber"];
  SafeInt: Scalars["SafeInt"];
  SemVer: Scalars["SemVer"];
  SomethingWentWrong: GqlSomethingWentWrong;
  String: Scalars["String"];
  Success: GqlSuccess;
  Time: Scalars["Time"];
  TimeZone: Scalars["TimeZone"];
  Timestamp: Scalars["Timestamp"];
  URL: Scalars["URL"];
  USCurrency: Scalars["USCurrency"];
  UUID: Scalars["UUID"];
  UnsignedFloat: Scalars["UnsignedFloat"];
  UnsignedInt: Scalars["UnsignedInt"];
  User: GqlUser;
  UtcOffset: Scalars["UtcOffset"];
  Void: Scalars["Void"];
};

export interface GqlAccountNumberScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["AccountNumber"], any> {
  name: "AccountNumber";
}

export interface GqlBigIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["BigInt"], any> {
  name: "BigInt";
}

export interface GqlByteScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Byte"], any> {
  name: "Byte";
}

export type GqlCategoryResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Category"] = GqlResolversParentTypes["Category"]> = {
  attributes?: Resolver<GqlResolversTypes["JSONObject"], ParentType, ContextType>;
  name?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlCountryCodeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["CountryCode"], any> {
  name: "CountryCode";
}

export interface GqlCuidScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Cuid"], any> {
  name: "Cuid";
}

export interface GqlCurrencyScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Currency"], any> {
  name: "Currency";
}

export interface GqlDidScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["DID"], any> {
  name: "DID";
}

export interface GqlDateScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Date"], any> {
  name: "Date";
}

export interface GqlDateTimeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export interface GqlDateTimeIsoScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["DateTimeISO"], any> {
  name: "DateTimeISO";
}

export interface GqlDeweyDecimalScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["DeweyDecimal"], any> {
  name: "DeweyDecimal";
}

export interface GqlDurationScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Duration"], any> {
  name: "Duration";
}

export interface GqlEmailAddressScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["EmailAddress"], any> {
  name: "EmailAddress";
}

export type GqlErrorResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Error"] = GqlResolversParentTypes["Error"]> = {
  code?: Resolver<Maybe<GqlResolversTypes["ErrorCode"]>, ParentType, ContextType>;
  message?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlGuidScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["GUID"], any> {
  name: "GUID";
}

export interface GqlHslScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["HSL"], any> {
  name: "HSL";
}

export interface GqlHslaScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["HSLA"], any> {
  name: "HSLA";
}

export interface GqlHexColorCodeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["HexColorCode"], any> {
  name: "HexColorCode";
}

export interface GqlHexadecimalScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Hexadecimal"], any> {
  name: "Hexadecimal";
}

export interface GqlIbanScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["IBAN"], any> {
  name: "IBAN";
}

export interface GqlIpScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["IP"], any> {
  name: "IP";
}

export interface GqlIpcPatentScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["IPCPatent"], any> {
  name: "IPCPatent";
}

export interface GqlIPv4ScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["IPv4"], any> {
  name: "IPv4";
}

export interface GqlIPv6ScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["IPv6"], any> {
  name: "IPv6";
}

export interface GqlIsbnScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["ISBN"], any> {
  name: "ISBN";
}

export interface GqlIso8601DurationScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["ISO8601Duration"], any> {
  name: "ISO8601Duration";
}

export interface GqlJsonScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["JSON"], any> {
  name: "JSON";
}

export interface GqlJsonObjectScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["JSONObject"], any> {
  name: "JSONObject";
}

export interface GqlJwtScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["JWT"], any> {
  name: "JWT";
}

export type GqlJwtTokenResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["JwtToken"] = GqlResolversParentTypes["JwtToken"]> = {
  access?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  refresh?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlLccSubclassScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["LCCSubclass"], any> {
  name: "LCCSubclass";
}

export interface GqlLatitudeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Latitude"], any> {
  name: "Latitude";
}

export interface GqlLocalDateScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["LocalDate"], any> {
  name: "LocalDate";
}

export interface GqlLocalDateTimeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["LocalDateTime"], any> {
  name: "LocalDateTime";
}

export interface GqlLocalEndTimeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["LocalEndTime"], any> {
  name: "LocalEndTime";
}

export interface GqlLocalTimeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["LocalTime"], any> {
  name: "LocalTime";
}

export interface GqlLocaleScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Locale"], any> {
  name: "Locale";
}

export interface GqlLongScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Long"], any> {
  name: "Long";
}

export interface GqlLongitudeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Longitude"], any> {
  name: "Longitude";
}

export interface GqlMacScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["MAC"], any> {
  name: "MAC";
}

export type GqlMutationResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Mutation"] = GqlResolversParentTypes["Mutation"]> = {
  createCategory?: Resolver<GqlResolversTypes["Category"], ParentType, ContextType, RequireFields<GqlMutationCreateCategoryArgs, "category">>;
  login?: Resolver<Maybe<GqlResolversTypes["JwtToken"]>, ParentType, ContextType, RequireFields<GqlMutationLoginArgs, "password" | "username">>;
  refresh?: Resolver<Maybe<GqlResolversTypes["JwtToken"]>, ParentType, ContextType, RequireFields<GqlMutationRefreshArgs, "token">>;
  register?: Resolver<Maybe<GqlResolversTypes["RegisterResponse"]>, ParentType, ContextType, RequireFields<GqlMutationRegisterArgs, "email" | "password" | "username">>;
  verifyEmail?: Resolver<Maybe<GqlResolversTypes["Success"]>, ParentType, ContextType, RequireFields<GqlMutationVerifyEmailArgs, "confirmToken" | "emailToken">>;
};

export interface GqlNegativeFloatScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NegativeFloat"], any> {
  name: "NegativeFloat";
}

export interface GqlNegativeIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NegativeInt"], any> {
  name: "NegativeInt";
}

export interface GqlNonEmptyStringScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NonEmptyString"], any> {
  name: "NonEmptyString";
}

export interface GqlNonNegativeFloatScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NonNegativeFloat"], any> {
  name: "NonNegativeFloat";
}

export interface GqlNonNegativeIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NonNegativeInt"], any> {
  name: "NonNegativeInt";
}

export interface GqlNonPositiveFloatScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NonPositiveFloat"], any> {
  name: "NonPositiveFloat";
}

export interface GqlNonPositiveIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NonPositiveInt"], any> {
  name: "NonPositiveInt";
}

export interface GqlObjectIdScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["ObjectID"], any> {
  name: "ObjectID";
}

export interface GqlPhoneNumberScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["PhoneNumber"], any> {
  name: "PhoneNumber";
}

export interface GqlPortScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Port"], any> {
  name: "Port";
}

export interface GqlPositiveFloatScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["PositiveFloat"], any> {
  name: "PositiveFloat";
}

export interface GqlPositiveIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["PositiveInt"], any> {
  name: "PositiveInt";
}

export interface GqlPostalCodeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["PostalCode"], any> {
  name: "PostalCode";
}

export type GqlQueryResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Query"] = GqlResolversParentTypes["Query"]> = {
  categories?: Resolver<Array<GqlResolversTypes["Category"]>, ParentType, ContextType>;
  currentUser?: Resolver<GqlResolversTypes["User"], ParentType, ContextType>;
};

export interface GqlRgbScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["RGB"], any> {
  name: "RGB";
}

export interface GqlRgbaScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["RGBA"], any> {
  name: "RGBA";
}

export type GqlRegisterResponseResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["RegisterResponse"] = GqlResolversParentTypes["RegisterResponse"]> = {
  confirmToken?: Resolver<Maybe<GqlResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlRoutingNumberScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["RoutingNumber"], any> {
  name: "RoutingNumber";
}

export interface GqlSafeIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["SafeInt"], any> {
  name: "SafeInt";
}

export interface GqlSemVerScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["SemVer"], any> {
  name: "SemVer";
}

export type GqlSomethingWentWrongResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["SomethingWentWrong"] = GqlResolversParentTypes["SomethingWentWrong"]> = {
  errors?: Resolver<Array<GqlResolversTypes["Error"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlSuccessResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Success"] = GqlResolversParentTypes["Success"]> = {
  code?: Resolver<Maybe<GqlResolversTypes["SuccessCode"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlTimeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Time"], any> {
  name: "Time";
}

export interface GqlTimeZoneScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["TimeZone"], any> {
  name: "TimeZone";
}

export interface GqlTimestampScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Timestamp"], any> {
  name: "Timestamp";
}

export interface GqlUrlScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["URL"], any> {
  name: "URL";
}

export interface GqlUsCurrencyScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["USCurrency"], any> {
  name: "USCurrency";
}

export interface GqlUuidScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["UUID"], any> {
  name: "UUID";
}

export interface GqlUnsignedFloatScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["UnsignedFloat"], any> {
  name: "UnsignedFloat";
}

export interface GqlUnsignedIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["UnsignedInt"], any> {
  name: "UnsignedInt";
}

export type GqlUserResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["User"] = GqlResolversParentTypes["User"]> = {
  email?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  role?: Resolver<GqlResolversTypes["Role"], ParentType, ContextType>;
  username?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlUtcOffsetScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["UtcOffset"], any> {
  name: "UtcOffset";
}

export interface GqlVoidScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Void"], any> {
  name: "Void";
}

export type GqlResolvers<ContextType = any> = {
  AccountNumber?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Byte?: GraphQLScalarType;
  Category?: GqlCategoryResolvers<ContextType>;
  CountryCode?: GraphQLScalarType;
  Cuid?: GraphQLScalarType;
  Currency?: GraphQLScalarType;
  DID?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DateTimeISO?: GraphQLScalarType;
  DeweyDecimal?: GraphQLScalarType;
  Duration?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  Error?: GqlErrorResolvers<ContextType>;
  GUID?: GraphQLScalarType;
  HSL?: GraphQLScalarType;
  HSLA?: GraphQLScalarType;
  HexColorCode?: GraphQLScalarType;
  Hexadecimal?: GraphQLScalarType;
  IBAN?: GraphQLScalarType;
  IP?: GraphQLScalarType;
  IPCPatent?: GraphQLScalarType;
  IPv4?: GraphQLScalarType;
  IPv6?: GraphQLScalarType;
  ISBN?: GraphQLScalarType;
  ISO8601Duration?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  JWT?: GraphQLScalarType;
  JwtToken?: GqlJwtTokenResolvers<ContextType>;
  LCCSubclass?: GraphQLScalarType;
  Latitude?: GraphQLScalarType;
  LocalDate?: GraphQLScalarType;
  LocalDateTime?: GraphQLScalarType;
  LocalEndTime?: GraphQLScalarType;
  LocalTime?: GraphQLScalarType;
  Locale?: GraphQLScalarType;
  Long?: GraphQLScalarType;
  Longitude?: GraphQLScalarType;
  MAC?: GraphQLScalarType;
  Mutation?: GqlMutationResolvers<ContextType>;
  NegativeFloat?: GraphQLScalarType;
  NegativeInt?: GraphQLScalarType;
  NonEmptyString?: GraphQLScalarType;
  NonNegativeFloat?: GraphQLScalarType;
  NonNegativeInt?: GraphQLScalarType;
  NonPositiveFloat?: GraphQLScalarType;
  NonPositiveInt?: GraphQLScalarType;
  ObjectID?: GraphQLScalarType;
  PhoneNumber?: GraphQLScalarType;
  Port?: GraphQLScalarType;
  PositiveFloat?: GraphQLScalarType;
  PositiveInt?: GraphQLScalarType;
  PostalCode?: GraphQLScalarType;
  Query?: GqlQueryResolvers<ContextType>;
  RGB?: GraphQLScalarType;
  RGBA?: GraphQLScalarType;
  RegisterResponse?: GqlRegisterResponseResolvers<ContextType>;
  RoutingNumber?: GraphQLScalarType;
  SafeInt?: GraphQLScalarType;
  SemVer?: GraphQLScalarType;
  SomethingWentWrong?: GqlSomethingWentWrongResolvers<ContextType>;
  Success?: GqlSuccessResolvers<ContextType>;
  Time?: GraphQLScalarType;
  TimeZone?: GraphQLScalarType;
  Timestamp?: GraphQLScalarType;
  URL?: GraphQLScalarType;
  USCurrency?: GraphQLScalarType;
  UUID?: GraphQLScalarType;
  UnsignedFloat?: GraphQLScalarType;
  UnsignedInt?: GraphQLScalarType;
  User?: GqlUserResolvers<ContextType>;
  UtcOffset?: GraphQLScalarType;
  Void?: GraphQLScalarType;
};

