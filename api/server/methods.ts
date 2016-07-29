import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import {Profile} from 'api/models';
import {Chats, Messages} from './collections';

const nonEmptyString = Match.Where((str) => {
  check(str, String);
  return str.length > 0;
});


Meteor.methods({
  updateProfile(profile: Profile): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');

    check(profile, {
      name: nonEmptyString,
      picture: nonEmptyString
    });

    Meteor.users.update(this.userId, {
      $set: {profile}
    });
  },

  addMessage(chatId: string, content: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');

    check(chatId, nonEmptyString);
    check(content, nonEmptyString);

    const chatExists = !!Chats.find(chatId).count();

    if (!chatExists) throw new Meteor.Error('chat-not-exists',
      'Chat doesn\'t exist');

    Messages.insert({
      chatId: chatId,
      senderId: this.userId,
      content: content,
      createdAt: new Date()
    });
  }
});