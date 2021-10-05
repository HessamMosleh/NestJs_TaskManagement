//feature
class FriendList {
  freinds = [];

  addFriend(name) {
    this.freinds.push(name);
    this.announceFriendShip(name);
  }

  announceFriendShip(name) {
    console.log(`${name} is now friend`);
  }

  removeFriend(name) {
    const idx = this.freinds.indexOf(name);
    if (idx === -1) throw new Error('Friend dose not found');

    this.freinds.splice(idx, 1);
  }
}

//test
describe('FriendList', () => {
  let friendList;
  beforeEach(() => {
    friendList = new FriendList();
  });

  it('initials friendList', () => {
    expect(friendList.freinds.length).toEqual(0);
  });

  it('add friend to list', () => {
    friendList.addFriend('Arial');
    expect(friendList.freinds.length).toEqual(1);
  });

  it('announces friendship', () => {
    friendList.announceFriendShip = jest.fn();
    expect(friendList.announceFriendShip).not.toHaveBeenCalled();
    friendList.addFriend('Arial');
    // expect(friendList.announceFriendShip).toHaveBeenCalledTimes(1);
    // expect(friendList.announceFriendShip).toHaveBeenCalledWith('Arial');
    expect(friendList.announceFriendShip).toHaveBeenCalled();
  });

  describe('Remove friend', () => {
    it('remove friend', () => {
      friendList.addFriend('Arial');
      expect(friendList.freinds[0]).toEqual('Arial');
      friendList.removeFriend('Arial');
      expect(friendList.freinds.length[0]).toBeUndefined();
    });

    it('throw an error as friend dose not exist', () => {
      expect(() => friendList.removeFriend('Arial')).toThrow(
        new Error('Friend dose not found'),
      );
    });
  });
});
