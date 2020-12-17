import PhotoGangBanger from './PhotoGangBanger';
import React from 'react';
import { shallow, render } from 'enzyme';
import { activePhotoGangBangers } from '../../views/About/mockdata';
import { User } from '../../views/MyProfile/mockdata';

const user = activePhotoGangBangers[0];
describe('PhotoGangBanger', () => {
  it('Test matching snapshot', () => {
    const rendered = shallow(<PhotoGangBanger {...user} />);
    expect(rendered).toMatchSnapshot();
  });
  it('Test if div gets created', () => {
    const rendered = shallow(<PhotoGangBanger name={user.name} {...user} />);
    expect(rendered.find('.profileInformation')).toHaveLength(1);
  });
});
