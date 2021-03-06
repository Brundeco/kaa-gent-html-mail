@extends('layouts.app')

@php
$title = 'Contact';
$menuItem = 'contact';
$dataPage = 'contact';
$breadcrumbs = [
['label' => $title, 'url' => '#'],
];
@endphp

@section('content')
<div class="section">
  <div class="container">

    @include('components.base.breadcrumbs')

    <div id="map" class="map"></div>

    <h1>{{ $title }}</h1>

    <div class="grid">
      <div class="grid__item medium--one-half">
        <h2>Adres</h2>
      </div>
      <div class="grid__item medium--one-half">
        <h2>Contacteer ons</h2>

        @include('components.forms.contact')

      </div>
    </div>

  </div>
</div>
@endsection
