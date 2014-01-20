# ---+ Extensions
# ---++ NatSkin
# ---+++ Themes
# **PERL**
$Foswiki::cfg{NatSkin}{Themes} = {
  JazzyNote => {
    baseUrl => '%PUBURLPATH%/%SYSTEMWEB%/JazzyNoteTheme',
    logoUrl => '%PUBURLPATH%/%SYSTEMWEB%/JazzyNoteTheme/jazzynote-logo.png',
    styles => {
      jazzynote => 'JazzyNoteStyle.css' 
    },
    variations => {
      green => 'GreenVariation.css', 
      red => 'RedVariation.css' 
    }
  },
  Customato => {
    baseUrl => '%PUBURLPATH%/%SYSTEMWEB%/CustomatoTheme',
    logoUrl => '%PUBURLPATH%/%SYSTEMWEB%/CustomatoTheme/foswiki-logo.png',
    styles => {
       customato => 'customato.css',
    }
  },
};

1;
