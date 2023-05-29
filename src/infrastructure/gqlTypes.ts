import { GraphQLResolveInfo } from "graphql";


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
  access: Scalars["String"];
  refresh: Scalars["String"];
};

export type GqlMutation = {
  login?: Maybe<GqlJwtToken>;
  refresh?: Maybe<GqlJwtToken>;
  register?: Maybe<GqlSuccess>;
  verifyEmail?: Maybe<GqlSuccess>;
};


export type GqlMutationLoginArgs = {
  password: Scalars["String"];
  username: Scalars["String"];
};


export type GqlMutationRefreshArgs = {
  token: Scalars["String"];
};


export type GqlMutationRegisterArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
  username: Scalars["String"];
};


export type GqlMutationVerifyEmailArgs = {
  token: Scalars["Int"];
};

export type GqlQuery = {
  users?: Maybe<Array<Maybe<GqlUser>>>;
};

export enum GqlRole {
  Admin = "Admin",
  Standalone = "Standalone"
}

export type GqlSomethingWentWrong = {
  errors: Array<GqlError>;
};

export type GqlSuccess = {
  code?: Maybe<GqlSuccessCode>;
};

export enum GqlSuccessCode {
  ConfirmAction = "ConfirmAction",
  Oke = "Oke"
}

export type GqlUser = {
  email: Scalars["String"];
  role: GqlRole;
  username: Scalars["String"];
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
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Error: ResolverTypeWrapper<GqlError>;
  ErrorCode: GqlErrorCode;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  JwtToken: ResolverTypeWrapper<GqlJwtToken>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Role: GqlRole;
  SomethingWentWrong: ResolverTypeWrapper<GqlSomethingWentWrong>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Success: ResolverTypeWrapper<GqlSuccess>;
  SuccessCode: GqlSuccessCode;
  User: ResolverTypeWrapper<GqlUser>;
};

/** Mapping between all available schema types and the resolvers parents */
export type GqlResolversParentTypes = {
  Boolean: Scalars["Boolean"];
  Error: GqlError;
  Int: Scalars["Int"];
  JwtToken: GqlJwtToken;
  Mutation: {};
  Query: {};
  SomethingWentWrong: GqlSomethingWentWrong;
  String: Scalars["String"];
  Success: GqlSuccess;
  User: GqlUser;
};

export type GqlErrorResolvers<ContextType = any, ParentType extends GqlResolversParentTypes['Error'] = GqlResolversParentTypes['Error']> = {
  code?: Resolver<Maybe<GqlResolversTypes["ErrorCode"]>, ParentType, ContextType>;
  message?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlJwtTokenResolvers<ContextType = any, ParentType extends GqlResolversParentTypes['JwtToken'] = GqlResolversParentTypes['JwtToken']> = {
  access?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  refresh?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlMutationResolvers<ContextType = any, ParentType extends GqlResolversParentTypes['Mutation'] = GqlResolversParentTypes['Mutation']> = {
  login?: Resolver<Maybe<GqlResolversTypes["JwtToken"]>, ParentType, ContextType, RequireFields<GqlMutationLoginArgs, "password" | "username">>;
  refresh?: Resolver<Maybe<GqlResolversTypes["JwtToken"]>, ParentType, ContextType, RequireFields<GqlMutationRefreshArgs, "token">>;
  register?: Resolver<Maybe<GqlResolversTypes["Success"]>, ParentType, ContextType, RequireFields<GqlMutationRegisterArgs, "email" | "password" | "username">>;
  verifyEmail?: Resolver<Maybe<GqlResolversTypes["Success"]>, ParentType, ContextType, RequireFields<GqlMutationVerifyEmailArgs, "token">>;
};

export type GqlQueryResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Query"] = GqlResolversParentTypes["Query"]> = {
  users?: Resolver<Maybe<Array<Maybe<GqlResolversTypes["User"]>>>, ParentType, ContextType>;
};

export type GqlSomethingWentWrongResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["SomethingWentWrong"] = GqlResolversParentTypes["SomethingWentWrong"]> = {
  errors?: Resolver<Array<GqlResolversTypes["Error"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlSuccessResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Success"] = GqlResolversParentTypes["Success"]> = {
  code?: Resolver<Maybe<GqlResolversTypes["SuccessCode"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlUserResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["User"] = GqlResolversParentTypes["User"]> = {
  email?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  role?: Resolver<GqlResolversTypes["Role"], ParentType, ContextType>;
  username?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlResolvers<ContextType = any> = {
  Error?: GqlErrorResolvers<ContextType>;
  JwtToken?: GqlJwtTokenResolvers<ContextType>;
  Mutation?: GqlMutationResolvers<ContextType>;
  Query?: GqlQueryResolvers<ContextType>;
  SomethingWentWrong?: GqlSomethingWentWrongResolvers<ContextType>;
  Success?: GqlSuccessResolvers<ContextType>;
  User?: GqlUserResolvers<ContextType>;
};

