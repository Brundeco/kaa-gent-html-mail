@extends('layouts.app')

@php
$title = 'Cookieverklaring';
$breadcrumbs = [
['label' => $title, 'url' => '#'],
];

// Cookie policy template variables
$displayName = 'Esign';
$type = 'De website'; // 'Het platform', 'De applicatie'
$typePossessive = 'Onze website'; // 'Ons platform', 'Onze applicatie'
$urlPrivacy = 'privacy.html';
$email = 'hello@esign.eu';
$cookieNotificationIncluded = true;
@endphp

@section('content')
<div class="section">
  <div class="container">

    @include('components.base.breadcrumbs')

    <h1>{{ $title }}</h1>

    <div class="rte">
      <h2>Cookies</h2>

      <p>
        Cookies zijn kleine data- of tekstbestanden die door websites en applicaties op uw lokale computer worden geplaatst.
        Dergelijke cookies kunnen verschillende doeleinden hebben: er zijn technische cookies (bijvoorbeeld voor het bijhouden
        van taalinstellingen), sessiecookies (tijdelijke cookies die verlopen na één sessie) en tracking cookies
        (cookies die uw gedrag op het internet volgen en bijhouden, om u op die manier een meer optimale gebruikservaring te
        kunnen aanbieden).
      </p>

      <p>
        De Belgische Wet betreffende de elektronische communicatie van 13 juni 2005 bevat enkele bepalingen rond cookies en
        het gebruik ervan op websites. De wet is een omzetting van de Europese e-Privacyrichtlijn, wat betekent dat de
        cookiewetgeving verschillend kan geïmplementeerd worden in andere Europese lidstaten.
      </p>

      <p>
        {{ $displayName }} is gevestigd in België en volgt bijgevolg de Belgische wetgeving inzake cookies.
      </p>

      <h2>Doel en nut van cookies</h2>
      <p>
        Door {{ strtolower($type) }} te gebruiken gaat de bezoeker akkoord met het gebruik van cookies. Cookies helpen
        {{ $displayName }} om uw bezoek aan {{ strtolower($type) }} te optimaliseren, om technische keuzes te herinneren
        (bijvoorbeeld een taalkeuze, een nieuwsbrief, et cetera) en om u meer relevante diensten en aanbiedingen te tonen.
        Indien u de cookies liever niet wenst, bent u als bezoeker vrij om de cookies uit te schakelen door de instellingen
        van uw browser aan te passen (“Management of cookies”).
      </p>
      <p>
        Zonder ingeschakelde cookies kan {{ $displayName }} geen probleemloos bezoek op {{ strtolower($type) }} garanderen.
      </p>

      <h2>Soorten cookies gebruikt door {{ $displayName }}</h2>

      <p>
        We onderscheiden volgende types cookies, naargelang hun doeleinden:
      </p>

      <ul>
        <li>
          <strong>Essentiële/ Strikt noodzakelijke cookies:</strong>
          <p>Deze cookies zijn nodig om {{ strtolower($type) }} te laten functioneren en kunnen niet worden uitgeschakeld in
            onze systemen. Ze worden meestal alleen ingesteld als reactie op acties die door u zijn gesteld, zoals het instellen
            van uw privacyvoorkeuren, inloggen of het invullen van formulieren. Ze zijn noodzakelijk voor een goede communicatie
            en ze vergemakkelijken het navigeren (bijvoorbeeld naar een vorige pagina terugkeren, etc.).</p>
        </li>
        <li>
          <strong>Niet-essentiële cookies:</strong>
          <p>Deze cookies zijn op zich niet noodzakelijk om {{ strtolower($type) }} te laten functioneren, maar ze helpen
            ons wel een verbeterde en gepersonaliseerde website aan te bieden.</p>
          <ul>
            <li>
              <strong>Functionele cookies:</strong>
              <p>Deze cookies stellen {{ strtolower($type) }} in staat om verbeterde functionaliteit en personalisatie te
                bieden. Ze kunnen worden ingesteld door ons of door externe providers wiens diensten we hebben toegevoegd
                aan onze pagina's.</p>
            </li>
            <li>
              <strong>Analytische cookies:</strong>
              <p>Met deze cookies kunnen we bezoeken en traffic bijhouden, zodat we de prestaties van
                {{ strtolower($typePossessive) }} kunnen meten en verbeteren. Ze helpen ons te weten welke pagina's het
                meest en het minst populair zijn en hoe bezoekers zich door {{ strtolower($type) }} verplaatsen.</p>
            </li>
            <li>
              <strong>Targeting / advertising cookies:</strong>
              <p>
                Deze cookies kunnen door onze advertentiepartners via {{ strtolower($typePossessive) }} worden
                ingesteld.<br>
                Ze kunnen door die bedrijven worden gebruikt om een profiel van uw interesses samen te stellen en u
                relevante advertenties op andere sites te laten zien.
              </p>
            </li>
          </ul>
        </li>
      </ul>

      <p>
        Wij gebruiken enerzijds onze eigen cookies en anderzijds cookies van zorgvuldig geselecteerde partners met wie we
        samenwerken en die onze diensten op hun website adverteren.
      </p>
      <ul>
        <li>
          <strong>First-party cookies</strong> zijn die door ons op onze websites zijn geplaatst.
        </li>
        <li>
          <strong>Third-party cookies</strong> worden ingesteld door een ander domein dan dat van de bezochte website (b.v. Google Analytics cookies).
        </li>
        <li>
          <strong>Session cookies</strong> worden gewist wanneer een gebruiker zijn browser sluit.
        </li>
        <li>
          <strong>Persistent cookies</strong> blijven gedurende een bepaalde periode op het apparaat van de gebruiker (b.v. 1 dag, 1 maand, 2 jaar…).
        </li>
      </ul>


      <p>Hieronder vindt u een overzicht van de cookies die {{ $displayName }} op haar websites gebruikt.</p>

      <table>
        <thead>
          <tr>
            <th>Naam</th>
            <th>Functie</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>_ga</td>
            <td>
              Registreert een unieke ID die wordt gebruikt om statistische gegevens te
              genereren over hoe de bezoeker {{ strtolower($type) }} gebruikt.
            </td>
          </tr>
          <tr>
            <td>_gat</td>
            <td>
              Gebruikt door Google Analytics.
            </td>
          </tr>
          <tr>
            <td>_gid</td>
            <td>
              Registreert een unieke ID die wordt gebruikt om statistische gegevens te
              genereren over hoe de bezoeker {{ strtolower($type) }} gebruikt.
            </td>
          </tr>
          <tr>
            <td>collect</td>
            <td>
              Gebruikt om gegevens naar Google Analytics te sturen over het apparaat en
              het gedrag van de bezoeker.
            </td>
          </tr>
          @if($cookieNotificationIncluded)
          <tr>
            <td>cookie_settings__analytics</td>
            <td>
              Gebruikt om gegevens naar Google Tag Manager te sturen over de cookie
              voorkeuren van de bezoeker.
            </td>
          </tr>
          @endif
        </tbody>
      </table>

      <p>
        We gebruiken een aantal van de onderstaande services voor advertenties op basis van uw
        webactiviteit of voor remarketing doeleinden:
      </p>

      <p>
        <strong>Google Adwords</strong>
      </p>
      <p>
        We gebruiken Google AdWords, waarmee we {{ strtolower($typePossessive) }} kunnen adverteren in de zoekresultaten
        van Google en op websites van derden. Daartoe plaatst Google een cookie in de browser van
        uw toestel, die automatisch een pseudonymous cookie-ID gebruikt op basis van de pagina’s die
        u hebt bezocht om op interesses gebaseerd adverteren mogelijk te maken. Meer informatie over
        adverteren en Google is te vinden op: https://policies.google.com/technologies/ads.
      </p>

      <p>
        <strong>Facebook Pixel</strong>
      </p>

      <p>
        We gebruiken de “Facebook pixel” van Facebook. Hierdoor kan gebruikersgedrag worden gevolgd
        nadat ze zijn doorgestuurd naar {{ strtolower($type) }} van {{ $displayName }} door op een Facebook-advertentie
        te klikken. Dit stelt ons in staat om de effectiviteit van Facebook-advertenties te meten
        voor statistische en markt onderzoeksdoeleinden. De op deze manier verzamelde gegevens zijn
        anoniem voor ons. We gebruiken pixel data om ervoor te zorgen dat advertenties aan de juiste
        mensen worden getoond en om een advertentie doelgroep op te bouwen. Ga
        naar http://www.aboutads.info/choices/ als u Facebook-cookies in uw browser wilt uitschakelen.
      </p>

      <p>
        <strong>LinkedIn Ads</strong>
      </p>
      <p>
        We gebruiken de LinkedIn Ads-cookie om het succes van LinkedIn-advertenties bij te houden. Deze cookie
        is een analysetool waarmee we de effectiviteit van advertenties kunnen meten door inzicht te krijgen in
        de acties die mensen op {{ strtolower($typePossessive) }} ondernemen. LinkedIn gebruikt cookiegegevens om inloggen op LinkedIn
        op {{ strtolower($typePossessive) }} mogelijk te maken en / of om de LinkedIn-functie ‘delen’ in te schakelen. Ga naar
        https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out als u LinkedIn cookies in uw browser wilt uitschakelen.
      </p>

      <p>
        Lees aandachtig ons <a href="{{ $urlPrivacy }}">privacybeleid</a> voor meer informatie over de verwerking van
        persoonsgegevens door {{ $displayName }}.
      </p>

      <h2>Beheer van de cookies</h2>

      <p>
        Zorg ervoor dat cookies zijn ingeschakeld in uw browser.  Als u {{ strtolower($type) }} van {{ $displayName }} wilt bezoeken,
        is het aangeraden cookies in te schakelen. Echter bent u vrij om deze uit te schakelen in je browserinstellingen, als u dat
        wenst. Om cookies in of uit te schakelen moet u uw browserinstellingen aanpassen (via het “instellingen” of “opties” tabblad).
        Onderstaande links geven u meer informatie over hoe u uw cookies kunt beheren.
      </p>

      <ul>
        <li>
          <a href="https://support.microsoft.com/en-gb/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener">Hoe cookies te verwijderen en te beheren in Internet Explorer</a>
        </li>
        <li>
          <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectlocale=en-US&redirectslug=enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener">Hoe cookies te verwijderen en te beheren in Mozilla Firefox</a>
        </li>
        <li>
          <a href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=en-GB" target="_blank" rel="noopener">Hoe cookies te verwijderen en te beheren in Chrome</a>
        </li>
        <li>
          <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Hoe cookies te verwijderen en te beheren in Safari </a>
        </li>
      </ul>

      @if($cookieNotificationIncluded)
       <p>
        <a href="#" class="js-cookie-notification-trigger">Mijn voorkeuren wijzigen</a>
      </p>
      @endif


      <h2>Rechten van de bezoekers</h2>

      <p>
        Aangezien cookies een verwerking van persoonsgegevens kunnen uitmaken, heeft u als betrokkene recht op de
        rechtmatige en veilige verwerking van de persoonsgegevens. Meer informatie over de rechten van bezoekers
        vindt u ook in de <a href="{{ $urlPrivacy }}">Privacyverklaring</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Mocht u na het lezen van deze Cookieverklaring toch nog vragen of opmerkingen rond cookies hebben, kan u steeds contact opnemen via <a
          href="mailto:{{ $email }}">{{ $email }}</a>.
      </p>
    </div>
  </div>
</div>
@stop
