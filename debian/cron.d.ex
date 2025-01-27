#
# Regular cron jobs for the foswiki-imageplugin package
#
0 4	* * *	root	[ -x /usr/bin/foswiki-imageplugin_maintenance ] && /usr/bin/foswiki-imageplugin_maintenance
