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

    <h1>Camper</h1>

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

  </div>
</div>
@endsection
