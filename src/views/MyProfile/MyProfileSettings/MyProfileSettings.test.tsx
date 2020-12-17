import React from 'react';
import { shallow } from 'enzyme';
import MyProfileSetting from './MyProfileSettings';
import '@testing-library/dom';
import {
  render,
  cleanup,
  getByText,
  screen,
  fireEvent,
  waitFor,
  waitForElement,
  getAllByAltText,
  findByText,
  waitForDomChange
} from '@testing-library/react';
import axios from 'axios';
import { mockUser } from './mockdata';
import { mocked } from 'ts-jest';
let MockAdapter = require('axios-mock-adapter');
import { apiCalls } from './apiCalls';
import { isExportDeclaration } from 'typescript';
import { api } from '../../../utils/api/api';

let mock: any;
let url: string;
beforeEach(() => {});

afterEach(() => {});
describe('<MyProfileSettings/>', () => {
  it('renders', () => {
    const { debug, getByText } = render(<MyProfileSetting></MyProfileSetting>);
    expect(screen.queryByTestId('component')).toBeDefined();
  });
  it('It shows correct form if user is fetched', async () => {
    mock = new MockAdapter(api);
    mock.onGet('/api/v1/photo_gang_bangers').reply(200, { mockUser });
    const { debug, getByText } = render(<MyProfileSetting></MyProfileSetting>);
    // expect(screen.getByText(mockUser.firstName)).toBeDefined();

    let user = await waitFor(() => getByText('Fredrik'));
    // const user = await screen.getByText(mockUser.firstName);
    console.log('fetched user from dom');
    console.log(user);
    expect(user).toBeDefined();
  });
});
