# ---+ Extensions
# ---++ NatSkin
# **PERL**
# This setting is required to enable executing natsearch from the bin directory
$Foswiki::cfg{SwitchBoard}{natsearch} = ['Foswiki::Plugins::NatSkinPlugin::Search', 'searchCgi', {natsearch => 1}];

1;

