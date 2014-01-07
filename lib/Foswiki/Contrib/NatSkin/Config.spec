# ---+ Extensions
# ---++ NatSkin
# ---+++ Themes
# **PERL**
$Foswiki::cfg{NatSkin}{Themes} = {
  JazzyNote => {
    baseUrl => '%PUBURLPATH%/%SYSTEMWEB%/JazzyNoteTheme',
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
       whity => 'customato.css',
    }
  },
};

1;
