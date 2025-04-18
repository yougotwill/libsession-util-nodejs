/// <reference path="../shared.d.ts" />

declare module 'libsession_util_nodejs' {
  /**
   *
   * UserGroups wrapper logic
   *
   */

  export type UserGroupsType = 'Community' | 'LegacyGroup' | 'Group';

  export type CommunityDetails = {
    fullUrlWithPubkey: string;
    baseUrl: string;
    roomCasePreserved: string;
  };

  export type CommunityInfo = CommunityDetails &
    WithPriority & {
      pubkeyHex: string;
    };

  export type LegacyGroupMemberInfo = {
    pubkeyHex: string;
    isAdmin: boolean;
  };

  type BaseUserGroup = WithPriority & {
    joinedAtSeconds: number; // equivalent to the lastJoinedTimestamp in Session desktop but in seconds rather than MS
    // NOTE Properties need to be optional going forward to backward compatibility
    disappearingTimerSeconds?: number; // in seconds, 0 or undefined == disabled.
  };

  export type LegacyGroupInfo = BaseUserGroup & {
    pubkeyHex: string; // The legacy group "session id" (33 bytes).
    name: string; // human-readable; this should normally always be set, but in theory could be set to an empty string.
    encPubkey: Uint8ArrayLen32; // bytes (32 or empty)
    encSeckey: Uint8Array; // bytes (32 or empty)
    members: Array<LegacyGroupMemberInfo>;
  };

  type UserGroupsGet = BaseUserGroup & {
    /**
     * The group "session id" (33 bytes), starting with 03.
     */
    pubkeyHex: GroupPubkeyType;
    /**
     * The group admin secret key if we have it, length 64.
     */
    secretKey: Uint8ArrayLen64 | null;
    /**
     * The group auth data we were given if we have it, length 100.
     */
    authData: Uint8ArrayLen100 | null;
    /**
     * The group name.
     */
    name: string | null;
    /**
     * True if the invite is pending, i.e. we've received it but haven't approved or auto-approved it yet.
     */
    invitePending: boolean;
    /**
     * If we were kicked from that group, this will be true.
     * Note: if the group was `destroyed` this will be false, but `destroyed` will be true
     */
    kicked: boolean;
    /**
     * If the group was destroyed, this will be true
     */
    destroyed: boolean;
  };

  /**
   * We can set anything on a UserGroup and can omit fields by explicitly setting them to null.
   * The only one which cannot be omitted is the pubkeyHex
   */
  type UserGroupsSet = Pick<UserGroupsGet, 'pubkeyHex'> &
    AllFieldsNullable<Omit<UserGroupsGet, 'pubkeyHex' | 'kicked' | 'destroyed'>>;

  type UserGroupsWrapper = BaseConfigWrapper & {
    init: (secretKey: Uint8Array, dump: Uint8Array | null) => void;
    /** This function is used to free wrappers from memory only */
    free: () => void;

    // Communities related methods
    /** Note: can have the pubkey argument set or not.  */
    getCommunityByFullUrl: (fullUrlWithOrWithoutPubkey: string) => CommunityInfo | null;

    /**
     * This will take care of duplicates and just return the existing one if one is already there matching it.
     * Note: this needs the pubkey to be provided in the argument as it might need to create it.
     */
    setCommunityByFullUrl: (fullUrlWithPubkey: string, priority: number) => null;
    getAllCommunities: () => Array<CommunityInfo>;

    /**
     * Note: can have the pubkey argument set or not.
     */
    eraseCommunityByFullUrl: (fullUrlWithOrWithoutPubkey: string) => void;
    buildFullUrlFromDetails: (baseUrl: string, roomId: string, pubkeyHex: string) => string;

    // Legacy groups related methods
    getLegacyGroup: (pubkeyHex: string) => LegacyGroupInfo | null;
    getAllLegacyGroups: () => Array<LegacyGroupInfo>;
    setLegacyGroup: (info: LegacyGroupInfo) => boolean;
    eraseLegacyGroup: (pubkeyHex: string) => boolean;

    // Groups related methods
    // the create group always returns the secretKey as we've just created it
    createGroup: () => UserGroupsGet & NonNullable<Pick<UserGroupsGet, 'secretKey'>>;
    getGroup: (pubkeyHex: GroupPubkeyType) => UserGroupsGet | null;
    getAllGroups: () => Array<UserGroupsGet>;
    setGroup: (info: UserGroupsSet) => UserGroupsGet;
    markGroupKicked: (pubkeyHex: GroupPubkeyType) => UserGroupsGet;
    markGroupInvited: (pubkeyHex: GroupPubkeyType) => UserGroupsGet;
    markGroupDestroyed: (pubkeyHex: GroupPubkeyType) => UserGroupsGet;
    eraseGroup: (pubkeyHex: GroupPubkeyType) => boolean;
  };

  export type UserGroupsWrapperActionsCalls = MakeWrapperActionCalls<UserGroupsWrapper>;

  export class UserGroupsWrapperNode extends BaseConfigWrapperNode {
    constructor(secretKey: Uint8Array, dump: Uint8Array | null);
    // communities related methods
    public getCommunityByFullUrl: UserGroupsWrapper['getCommunityByFullUrl'];
    public setCommunityByFullUrl: UserGroupsWrapper['setCommunityByFullUrl'];
    public getAllCommunities: UserGroupsWrapper['getAllCommunities'];
    public eraseCommunityByFullUrl: UserGroupsWrapper['eraseCommunityByFullUrl'];
    public buildFullUrlFromDetails: UserGroupsWrapper['buildFullUrlFromDetails'];

    // legacy-groups related methods
    public getLegacyGroup: UserGroupsWrapper['getLegacyGroup'];
    public getAllLegacyGroups: UserGroupsWrapper['getAllLegacyGroups'];
    public setLegacyGroup: UserGroupsWrapper['setLegacyGroup'];
    public eraseLegacyGroup: UserGroupsWrapper['eraseLegacyGroup'];

    // groups related methods
    public createGroup: UserGroupsWrapper['createGroup'];
    public getGroup: UserGroupsWrapper['getGroup'];
    public getAllGroups: UserGroupsWrapper['getAllGroups'];
    public setGroup: UserGroupsWrapper['setGroup'];
    public markGroupKicked: UserGroupsWrapper['markGroupKicked'];
    public markGroupInvited: UserGroupsWrapper['markGroupInvited'];
    public markGroupDestroyed: UserGroupsWrapper['markGroupDestroyed'];
    public eraseGroup: UserGroupsWrapper['eraseGroup'];
  }

  export type UserGroupsConfigActionsType =
    | ['init', Uint8Array, Uint8Array | null]
    | MakeActionCall<UserGroupsWrapper, 'free'>
    | MakeActionCall<UserGroupsWrapper, 'getCommunityByFullUrl'>
    | MakeActionCall<UserGroupsWrapper, 'setCommunityByFullUrl'>
    | MakeActionCall<UserGroupsWrapper, 'getAllCommunities'>
    | MakeActionCall<UserGroupsWrapper, 'eraseCommunityByFullUrl'>
    | MakeActionCall<UserGroupsWrapper, 'buildFullUrlFromDetails'>
    | MakeActionCall<UserGroupsWrapper, 'getAllLegacyGroups'>
    | MakeActionCall<UserGroupsWrapper, 'getLegacyGroup'>
    | MakeActionCall<UserGroupsWrapper, 'setLegacyGroup'>
    | MakeActionCall<UserGroupsWrapper, 'eraseLegacyGroup'>
    | MakeActionCall<UserGroupsWrapper, 'createGroup'>
    | MakeActionCall<UserGroupsWrapper, 'getGroup'>
    | MakeActionCall<UserGroupsWrapper, 'getAllGroups'>
    | MakeActionCall<UserGroupsWrapper, 'setGroup'>
    | MakeActionCall<UserGroupsWrapper, 'markGroupKicked'>
    | MakeActionCall<UserGroupsWrapper, 'markGroupInvited'>
    | MakeActionCall<UserGroupsWrapper, 'markGroupDestroyed'>
    | MakeActionCall<UserGroupsWrapper, 'eraseGroup'>;
}
