/// <reference path="../shared.d.ts" />
/// <reference path="./groupmembers.d.ts" />
/// <reference path="./groupinfo.d.ts" />
/// <reference path="./groupkeys.d.ts" />

declare module 'libsession_util_nodejs' {
  export type GroupWrapperConstructor = {
    userEd25519Secretkey: Uint8Array;
    groupEd25519Pubkey: Uint8Array;
    groupEd25519Secretkey: Uint8Array | null;
    dumpedInfo: Uint8Array | null;
    dumpedMembers: Uint8Array | null;
    dumpedKeys: Uint8Array | null;
  };

  type MetaGroupWrapper = GroupInfoWrapper &
    GroupMemberWrapper &
    GroupKeysWrapper & {
      // shared actions
      init: (options: GroupWrapperConstructor) => void;
      needsPush: () => boolean;
      push: () => Array<{ type: SubWrapperType; data: Uint8Array; seqno: number }>;
      needsDump: () => boolean;
      dump: () => Array<{ type: SubWrapperType; data: Uint8Array }>;
    };

  // this just adds an argument of type GroupPubkeyType in front of the parameters of that function
  type AddGroupPkToFunction<T extends (...args: any) => any> = (
    ...args: [GroupPubkeyType, ...Parameters<T>]
  ) => ReturnType<T>;

  export type MetaGroupWrapperActionsCalls = MakeWrapperActionCalls<{
    [key in keyof MetaGroupWrapper]: AddGroupPkToFunction<MetaGroupWrapper[key]>;
  }>;

  export class MetaGroupWrapperNode {
    constructor(GroupWrapperConstructor);

    // shared actions
    public needsPush: MetaGroupWrapper['needsPush'];
    public push: MetaGroupWrapper['push'];
    public needsDump: MetaGroupWrapper['needsDump'];
    public dump: MetaGroupWrapper['dump'];

    // info
    public infoGet: MetaGroupWrapper['infoGet'];
    public infoSet: MetaGroupWrapper['infoSet'];
    public infoDestroy: MetaGroupWrapper['infoDestroy'];

    // members
    public memberGet: MetaGroupWrapper['memberGet'];
    public memberGetOrConstruct: MetaGroupWrapper['memberGetOrConstruct'];
    public memberGetAll: MetaGroupWrapper['memberGetAll'];
    public memberSetAccepted: MetaGroupWrapper['memberSetAccepted'];
    public memberSetName: MetaGroupWrapper['memberSetName'];
    public memberSetPromoted: MetaGroupWrapper['memberSetPromoted'];
    public memberSetInvited: MetaGroupWrapper['memberSetInvited'];
    public memberErase: MetaGroupWrapper['memberErase'];
    public memberSetProfilePicture: MetaGroupWrapper['memberSetProfilePicture'];

    // keys

    public keysNeedsRekey: MetaGroupWrapper['keysNeedsRekey'];
    public keyRekey: MetaGroupWrapper['keyRekey'];
    public groupKeys: MetaGroupWrapper['groupKeys'];
    public loadKeyMessage: MetaGroupWrapper['loadKeyMessage'];
    public currentHashes: MetaGroupWrapper['currentHashes'];
    public encryptMessage: MetaGroupWrapper['encryptMessage'];
    public decryptMessage: MetaGroupWrapper['decryptMessage'];
  }

  export type MetaGroupActionsType =
    | ['init', GroupWrapperConstructor]
    // shared actions
    | MakeActionCall<MetaGroupWrapper, 'needsPush'>
    | MakeActionCall<MetaGroupWrapper, 'push'>
    | MakeActionCall<MetaGroupWrapper, 'needsDump'>
    | MakeActionCall<MetaGroupWrapper, 'dump'>

    // info actions
    | MakeActionCall<MetaGroupWrapper, 'infoGet'>
    | MakeActionCall<MetaGroupWrapper, 'infoSet'>
    | MakeActionCall<MetaGroupWrapper, 'infoDestroy'>

    // member actions
    | MakeActionCall<MetaGroupWrapper, 'memberGet'>
    | MakeActionCall<MetaGroupWrapper, 'memberGetOrConstruct'>
    | MakeActionCall<MetaGroupWrapper, 'memberGetAll'>
    | MakeActionCall<MetaGroupWrapper, 'memberSetAccepted'>
    | MakeActionCall<MetaGroupWrapper, 'memberSetName'>
    | MakeActionCall<MetaGroupWrapper, 'memberSetPromoted'>
    | MakeActionCall<MetaGroupWrapper, 'memberSetInvited'>
    | MakeActionCall<MetaGroupWrapper, 'memberErase'>
    | MakeActionCall<MetaGroupWrapper, 'memberSetProfilePicture'>

    // keys actions
    | MakeActionCall<MetaGroupWrapper, 'keysNeedsRekey'>
    | MakeActionCall<MetaGroupWrapper, 'keyRekey'>
    | MakeActionCall<MetaGroupWrapper, 'groupKeys'>
    | MakeActionCall<MetaGroupWrapper, 'loadKeyMessage'>
    | MakeActionCall<MetaGroupWrapper, 'currentHashes'>
    | MakeActionCall<MetaGroupWrapper, 'encryptMessage'>
    | MakeActionCall<MetaGroupWrapper, 'decryptMessage'>;
}
