package echo

func (my *Logger) ReportAndReturn(err error) error {
	my.Print(err)
	return err
}

func (my *Logger) ReportAndSubstitute(toReport, toReturn error) error {
	my.Print(toReport)
	return toReturn
}
