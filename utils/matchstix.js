// /*flow*/
// import Arrows from "./Arrows";
// const THREE_SECONDS = 3000;
// const {
//     AsyncA,
//     CpsA,
//     ProgressA,
//     ConstA,
//     Repeat
// } = Arrows;
//
// class MatchStix {
//   static cache (m) {
//     if (this._cache[m.matchId]) {
//       if (m.isStale()) {
//         return;
//       }
//     }
//     this.reserve(m.matchId,now());
//   };
//
//   static reserve(slug,ts) {
//     if (arguments[0] === undefined) throw "MatchStixerr -> reserve: String";
//     if (arguments[1] === undefined) throw "MatchStixerr -> reserve: TimeStamp";
//
//     const strSlug = slug.toString();
//     this._cache[strSlug]                     = true;
//     this._Map_MatchID_lastUpdatedAt[strSlug] = ts;
//     this._Map_MatchID_unreadCnt[strSlug]     = 0;
//     this._mCount++;
//   };
//
//   static appendMsg(matchId: integer, msgInfo: any){
//     this._Map_MatchID_unreadCnt[matchId]++;
//   };
//
//   static scaleUnread(slug, delta) {
//     const currentUnread = this._Map_MatchID_unreadCnt[slug];
//     let newCnt = Math.max(0, delta + currentUnread);
//     true; //- for debugging
//   };
//
//   static get matchCount(){
//     return this._mCount;
//   };
//
//   static get unreadCount() {
//     return _.reduce(Object.values(this._Map_MatchID_unreadCnt), (a, m) => a+m, 0);
//   };
// }
//
// MatchStix._cache                     = {};
// MatchStix._Map_MatchID_lastUpdatedAt = {};
// MatchStix._Map_MatchID_unreadCnt     = {};
// MatchStix._running                   = false;
// MatchStix._mCount                    = 0;
// MatchStix.currentMatchId             = null;
//
// class MatchPayload {
//   static __idcnt;
//
//   static nextId() {
//     if (this.__idcnt === undefined) this.__idcnt = 0;
//     return ++this.__idcnt;
//   }
//
//   constructor(isMessage: boolean,data: any) {
//     if (arguments[0] === undefined) throw "MatchPayloaderr -> isMessage: boolean";
//     if (arguments[1] === undefined) throw "MatchPayloadErr -> data: {}";
//
//     const { matchId, isFavourited, created_timestamp } = data;
//
//     this.isMessage       = isMessage;
//     this._id             = MatchPayload.nextId();
//     this.matchId         = matchId;
//     this.isFavourited    = isFavourited;
//     this.createdAt       = created_timestamp;
//     this.lastAccessedAt  = null;
//     this.data            = data;
//     this.isPriority      = false;
//
//     if (!this.isStale()) {
//       MatchStix.cache(this);
//       //MatchStix.scaleUnread(this.matchId, 1); // move it up one for each new match.
//     }
//     true; //- for debugging
//   }
//
//   isStale() {
//     return false;
//   }
//
//   touch() {
//     true //- for debugging;
//   }
// }
//
// class MatchInfo extends MatchPayload {
//   constructor(data: any) {
//     super(false,data);
//     this.messages = [];
//   }
//
//   touch() {
//     MatchStix.scaleUnread(this.matchId, -1);
//   }
// }
//
// class MessageInfo extends MatchPayload{
//   constructor(data: any) {
//     super(true,data);
//
//     const matchID=data.id;
//     MatchStix.appendMsg(matchID,data);
//   }
// }
//
// MatchStix.prototype = new AsyncA(function (ts,a){ // when the loop was triggered
//   true; //- for debugging
//   a.cont();
// })
//
// function now() {
//     let now = new Date();
//     return now.getTime();
// }
//
// function matchWasAdded(matchData: any) {
//   const { match_id , users , isFavourited, created_timestamp, recent_message} = matchData;
//   return new MatchInfo(matchData);
// }
//
//
// function messageWasAdded(messageData: any){
//   return new MessageInfo(messageData);
// }
//
// function shouldIgnoreMatchPayload(matchData: any) {
//   return matchData.ephemeral;
// }
//
// export { matchWasAdded, messageWasAdded, shouldIgnoreMatchPayload}
