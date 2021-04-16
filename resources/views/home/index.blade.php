@extends('layouts.app')

@php
$title = 'Home';
$menuItem = 'home';
// $description = 'description';
// $bodyClass = 'body-class';
@endphp

@section('content')
<div class="section">
  <div class="container">

    <h1>Front-end template webpack</h1>

    <div class="grid">
      <div class="grid__item medium--one-half">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu erat pulvinar, dignissim ante non,
          fringilla nisl. Aliquam vitae lorem eget velit elementum volutpat sit amet vel ex.</p>
      </div>
      <div class="grid__item medium--one-half">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu erat pulvinar, dignissim ante non,
          fringilla nisl. Aliquam vitae lorem eget velit elementum volutpat sit amet vel ex.</p>
      </div>
    </div>

    <h2 class="h3">Inline background image example</h2>
    <div style="background-image: url('${require(`../../assets/images/marker.png`)}'); height: 128px; width: 100px;">
    </div>

    <h2 class="h3">Webp image example</h2>
    <picture>
      {{-- Change image extension to webp when images are loaded from build folder --}}
      <source srcset="../../assets/images/marker.png" type="image/webp">
      <img src="../../assets/images/marker.png" alt="marker">
    </picture>
  </div>
</div>
@endsection
