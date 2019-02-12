/*
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Copyright (C) 2018 Foswiki Contributors. Foswiki Contributors
are listed in the AUTHORS file in the root of this distribution.
NOTE: Please extend that file, not this notice.

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version. For
more details read LICENSE in the root of this distribution.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

As per the GPL, removal of this notice is prohibited.

*/
"use strict";
jQuery(function($) {
   $(".jqParticles:not(.jqParticlesInited)").livequery(function() {
      var $this = $(this), 
          id = 'jqParticlesCanvas'+foswiki.getUniqueID(),
          opts = $.extend({selector:"#"+id}, $this.data()),
          canvas = $("<canvas />").attr("id", id).appendTo($this),
          particles;

      // add some adhoc breakpoints
      opts.responsive = [];
      $.each([1600, 1120, 1024, 800, 600], function(i, val) {
        var maxParticles = Math.floor(opts.maxParticles / (i+1));

        //console.log("breakpoint=",val,"maxParticles=",maxParticles);

        opts.responsive.push({
          breakpoint: val,
          options: {
            maxParticles: maxParticles
          }
        });
      });

      //console.log("opts=",opts);

      particles = Particles.init(opts);
      $this.data("Particles", particles).addClass("jqParticlesInited").on("click", function() {
        if (particles.options.maxParticles) {
          particles.options.maxParticles = 0;
	  particles.pauseAnimation();
        } else {
          particles.options.maxParticles = opts.maxParticles;
	  particles.resumeAnimation();
        }
        particles._refresh(); // SMELL: calling private function
      });

   });
});
