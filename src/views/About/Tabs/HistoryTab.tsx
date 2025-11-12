import React, { FC } from 'react';

import styles from "../About.module.css";
import cn from "classnames";

import {
    Typography,
    Grid,
    Link,
    
  } from "@mui/material";

const HistoryTab: FC = () => {
  return (

    <Grid container spacing={4} padding={"0.5em"}>

      <Grid item xs={12} md={6}>
          <Typography variant="h6">
              <b>HVORFOR HAR VI FOTOGJENGEN PÅ SAMF?</b>
          </Typography>
          <Typography paragraph>
              Fotogjengen er en gjeng ved <Link href="https://www.samfundet.no/">Studentersamfundet</Link> i Trondhjem. Vi
              har som oppgave å ta bilder av alt som skjer på Samfundet, under
              UKA og under ISFiT. Vi består av 12 fotofunksjonærer og
              webfunksjonærer. På denne siden finner du informasjon om oss og
              hvilke tjenester vi tilbyr.
          </Typography>
          <br />
          <Typography variant="h6">
              <b>HISTORIE</b>
          </Typography>
          <Typography>
              I Finansstyremøtet den 7. oktober 1958 ble det bestemt at
              Fotogjengen (FG) skulle være en «gjeng» i Huset, underlagt
              Finansstyret. Barnet var imidlertid nær konfirmasjonsalderen ved
              fødselen. Det første organiserte studentlynlys i Storsalen ble
              nemlig avfyrt under lørdagsmøtet 16. mars 1946. En liten gruppe
              utgått fra Studentenes Kameraklubb (S.K.) hadde fått Styrets
              tillatelse til å illustrere en reportasje fra studentlivet. 
              Som <Link href="https://fk.samfundet.no/">Forsterkerkomiteen</Link> (FK) 
              må også FG medgi at et avgjørende iniativ ble tatt av rastløse 
              entusiaster i <Link href="https://www.ark.no/">Akademisk Radioklubb</Link> (ARK) i en urtid.
          </Typography>
          <Grid container justifyContent="space-evenly" padding={"5vw 0"}>
            <Grid item> 
              <div className={cn(styles.redBackground, styles.round)}>
                <b>1942</b>
              </div>
            </Grid>
            <Grid item> 
              <div className={cn(styles.blueBackground, styles.round)}>
                <b>FG</b>
              </div>
            </Grid>
            <Grid item> 
              <div className={cn(styles.greenBackground, styles.round)}>
                <b>Hilfling</b>
              </div>
            </Grid>
          </Grid>

          <Typography>
            Så tidlig som i 1938 stiftet noen fotograferende amatørstudenter
            fra ARK Studentenes Kameraklubb, og showet var i gang. Men mye
            hadde skjedd enda tidligere. Helt tilbake til NTHs åpning i 1910
            finnes filmmateriale, uten at det har påkalt nevneverdig
            oppmerksomhet i tidligere utgaver av Studentersamfundets
            krøniker. Dette kapitlet vil derfor favne alt foto- og
            filmarbeid utført av Samfundsmedlemmer i Samfundets regi. Det er
            naturlig å skille mellom filmarbeid og stillbildefotografering.
            Plassen tillater dessverre ingen spontane skildringer fra FGs
            liv, og bildematerialet som vises er rent symbolsk.
          </Typography>

      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="h6">
          <b>HVEM VAR HILFLING</b>
        </Typography>
        <Typography paragraph>
          Fotograf Hilfling, senere hans sønn, Hilfling jr., var
          Studentersamfundets (og UKAs) faste fotograf fra starten i 1910
          til og med UKA-45, både av daglige og festlige begivenheter.
          Negativ-arkivet fra denne perioden er nå i forvaring ved
          Universitetsbiblioteket i Trondheim. Allerede tidlig i 30-årene
          hadde ARK innredet eget mørkerom i Huset. Til ARK søkte folk av
          alle slag, og 3. mai 1938 dannet en utbrytergruppe Studentenes
          Kameraklubb. 23.1.45 søkte de Studentersamfundet om å overta
          ARKs «to rum på klubbloftet når disse evakueres» og videre
          «Kameraklubben mener sig kompetent til som vederlag for adgang
          til lokaler å overta eventuell fotografering for
          Studentersamfundet. Slikt arbeide har allerede vært utført i
          mindre målestokk. En henviser til en bemerkning om UKA i Verdens
          Gang: «Det var bare fotograf-direktoratet som manglet...» Vi er
          i stand til å fylle dette savn». Studentersamfundet kunne
          imidlertid ikke ha følt savnet som sårt. Søknaden om lokale ble
          innvilget, men det ble ikke gjort noen avtale om fotografering.
        </Typography>
        <br />
        <Typography variant="h6">
          <b>OPPSTART AV FG</b>
        </Typography>
        <Typography paragraph>
          Høsten 1946 skrev redaktør Nic. Stabell i Under Dusken (UD) et
          åpent brev til S.K. hvor han etterlyste en kontinuerlig
          fotografering av begivenhetene i Studentersamfundet «til bruk
          både nå og i ettertid». Svaret fra S.K. var at S.K. trengte litt
          økonomisk støtte fra Finansstyret (FS) til å gjøre jobben, noe
          FS da ikke var villig til å yte. Etter søknad fikk S.K.
          fotograferingen ved UKA-47, en avtale sluttet på
          forretningsmessig basis. S.K. så denne oppgaven som en
          introduksjon til «et ledd i planen om en utstrakt fotografering
          med arkivering av Samfundet og Høgskolen». Dette skulle
          imidlertid ta sin tid. FS innvilget de fire medlemmene i S.K.s
          arbeidsutvalg Fotogjengen funksjonærkort f.o.m. høsten 1950. I
          tillegg fikk S.K.s arbeidsutvalg Fotogjengen disponere en
          kottliknende hybel. Mørkerom måtte lånes på Singsaker
          Studenthjem. Denne upraktiske arbeidssituasjonen fortsatte til
          FG ble fast gjeng. Den første noenlunde regelmessige
          fotografering og arkivering av Samfundsbegivenheter (utenom UKA)
          i FGs regi begynte våren 1950, men først på vårparten 1958 fikk
          S.K. presset FS til å nedsette et felles utvalg for å vurdere
          Fotogjengens drift og rolle i Huset. Og nå, etter mer enn 10 års
          virksomhet var tiden, eller kanskje heller FS, moden for å
          innlemme Fotogjengen som en av Husets faste gjenger, noe som
          også betød et mer ordnet forhold til UKA. FS påtok seg samtidig
          et beskjedent økonomisk ansvar som satte FG i stand til å holde
          kontinuitet i bildearkivet fra Samfundets arrangementer. Urtida
          var over.
        </Typography>
      </Grid>

    </Grid>
  )
}

export default HistoryTab;
