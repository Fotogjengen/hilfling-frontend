import React, { FC, useState, useEffect } from 'react';
import guistyles from 'hilfling-gui/lib/styles/utilities.module.css';
// import ProfileTags from "../../components/MyProfile/ProfileTags/ProfileTags";
import { mockUser } from './mockdata';
import { ProfileImage, Checkbox, Button } from 'hilfling-gui/lib';
import styles from './MyProfileSettings.module.css';
import cx from 'classnames';
import { useForm, Controller } from 'react-hook-form';
import { mergeWith } from 'lodash';

import {
  ChildPageHeader,
  Input,
  DropDown,
  RadioButton
} from 'hilfling-gui/lib';
import { User } from '../../../interfaces/User';
import { PhotoGangBanger } from '../../../interfaces/PhotoGangBanger';
import { Position } from '../../../interfaces/Position';
import { ErrorBoundary } from '../../../utils/error/ErrorBoundary';
import { useAsyncError } from '../../../utils/error/useAsyncError';
import { apiCalls } from './apiCalls';
import { api } from '../../../utils/api/api';

const MyProfileSetting: FC<{}> = () => {
  const userId = 1; // TODO: Endre dette til prop, eller state
  // Form
  const { register, errors, handleSubmit, watch, control } = useForm();

  //TODO: FETCH FROM API
  //const user: PhotoGangBanger = mockUser;
  const fgPositions: Array<string> = ['Web-sjef', 'Scrub'];
  const semesters: Array<string> = ['V2019', 'H2020'];
  const sexes = ['Mann', 'Kvinne'];
  // User
  const [user, setUser] = useState<PhotoGangBanger | null>();
  const [positions, setPositions] = useState<Array<Position> | null>();

  useEffect(() => {
    try {
      apiCalls.getData((user: PhotoGangBanger, positions: Array<Position>) => {
        setPositions(positions);
        setUser(user);
      });
      console.log(user);
    } catch (err) {
      console.log(err); //TODO: Fikse universal error message
    }
  }, [userId]);

  const onSubmit: any = (formData: any) => {
    function mergeCustomizer(objValue: any, srcValue: any): any {
      if (srcValue == '') return objValue;
    }
    // update user object with formdata
    mergeWith(formData, user, mergeCustomizer);
    apiCalls
      .updateUser(formData)
      .then(res => alert(res))
      .catch(err => console.log(err));
  };

  return (
    <div
      data-testid="component"
      className={cx(guistyles.contentContainer, styles.profileContainer)}
    >
      {user?.firstName}
      <ChildPageHeader
        title="INSTILLINGER"
        className={styles.titleContainer}
      ></ChildPageHeader>
      <ProfileImage
        className={styles.profileImageContainer}
        onClick={function() {}}
        alt="ProfileImage"
        src="https://avatars0.githubusercontent.com/u/5860069?s=220&v=4"
      ></ProfileImage>
      {user != null && positions ? (
        <div className={styles.settingsContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Fornavn</h2>
            <Input
              name="firstName"
              placeholder={user!.firstName}
              inputRef={register({ required: true })}
            ></Input>

            <h2>Etternavn</h2>
            <Input
              name="lastName"
              placeholder={user!.lastName}
              inputRef={register}
            ></Input>

            <h2>Kjønn</h2>
            <DropDown name="sex" options={sexes} inputRef={register}></DropDown>

            <h2>Telefonnummer</h2>
            <Input
              name="phoneNumber"
              placeholder={user!.phoneNumber}
              inputRef={register}
            ></Input>

            <h2>Adresse</h2>
            <Input
              name="address"
              placeholder={user!.address}
              inputRef={register}
            ></Input>

            <h2>By</h2>
            <Input
              name="city"
              placeholder={user!.city}
              inputRef={register}
            ></Input>

            <h2>Zip-kode</h2>
            <Input
              name="zipCode"
              placeholder={user!.zipCode.toString()}
              inputRef={register}
            ></Input>

            <h2>Aktiv i Fotogjengen?</h2>
            <RadioButton
              label="Aktiv"
              name="aktiv"
              checked={user!.active}
              inputRef={register}
            ></RadioButton>
            <RadioButton
              label="Pang"
              name="pang"
              checked={user!.pang}
              inputRef={register}
            ></RadioButton>

            <h2>Stilling</h2>
            <DropDown
              name="fgPosition"
              options={positions.map(x => x.title)}
              whenSelected={() => alert('JAJA')}
              inputRef={register}
            ></DropDown>

            <h2>Aktiv siden</h2>
            <DropDown
              name="semesters"
              options={semesters}
              whenSelected={() => alert('JAJA')}
              inputRef={register}
            ></DropDown>

            <h2>Sivilstatus</h2>
            <Input
              name="relatioshipStatus"
              placeholder={user!.relationshipStatus}
              inputRef={register}
            ></Input>

            <Button primary submit>
              Lagre
            </Button>
          </form>
        </div>
      ) : (
        <h1 data-testid="errorMessage">Failed to fetch data from server</h1>
      )}
    </div>
  );
};

export default MyProfileSetting;
