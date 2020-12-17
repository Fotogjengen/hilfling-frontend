import { User } from '../../../interfaces/User';
import { PhotoGangBanger } from '../../../interfaces/PhotoGangBanger';

export const mocktags = [
  'Gjengsjef',
  'Medlem siden: h2015',
  'tidliger: barsjef',
  'aktiv',
  'tidligere: arkivsjef'
];

export const mockUser: PhotoGangBanger = {
  firstName: 'Fredrik',
  lastName: 'Sivertsen',
  profilePicture: 'https://avatars0.githubusercontent.com/u/5860069?s=220&v=4',
  email: 'peklevstuen@gmail.com',
  username: 'pernilak',
  phoneNumber: '+47 420 69 666',
  sex: 'Mann',
  active: true,
  address: 'Elgesetergate 1',
  city: 'Trondheim',
  pang: false,
  relationshipStatus: 'singel',
  semesterStart: 'H2017',
  zipCode: 7050,
  title: 'Web-sjef'
};
