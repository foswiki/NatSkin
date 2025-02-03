# ---+ Extensions
# ---++ NatSkin
# ---+++ NatSkin Themes

# **PERL LABEL="Matter" **
$Foswiki::cfg{NatSkin}{Themes}{Matter} = {
  baseUrl => '%PUBURLPATH%/%SYSTEMWEB%/MatterTheme/build',
  logoUrl => '%PUBURLPATH%/%SYSTEMWEB%/ProjectLogos/foswiki-logo.svg',
  styles => {
     matter => 'matter.css',
  },
  variations => {
    topmenu => 'topmenuVariation.css',
  }
};

# ---+++ Deprecated NatSkin Themes
# **PERL LABEL="JazzyNote" **
$Foswiki::cfg{NatSkin}{Themes}{JazzyNote} = {
  baseUrl => '%PUBURLPATH%/%SYSTEMWEB%/JazzyNoteTheme',
  logoUrl => '%PUBURLPATH%/%SYSTEMWEB%/JazzyNoteTheme/jazzynote-logo.png',
  styles => {
    jazzynote => 'JazzyNoteStyle.css' 
  },
  variations => {
    green => 'GreenVariation.css', 
    red => 'RedVariation.css' 
  }
};

# **PERL LABEL="Customato"**
$Foswiki::cfg{NatSkin}{Themes}{Customato} = {
  baseUrl => '%PUBURLPATH%/%SYSTEMWEB%/CustomatoTheme/build',
  logoUrl => '%PUBURLPATH%/%SYSTEMWEB%/CustomatoTheme/images/foswiki-logo.png',
  styles => {
     customato => 'customato.css',
  },
  variations => {
    blue => 'blue.css'
  }
};

1;
