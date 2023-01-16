#!/usr/bin/python3
import MySQLdb
import cmd
import os
import uuid

class CommandLine(cmd.Cmd):
  prompt = '# '
  try:
    db = MySQLdb.connect(host="localhost",
                        port=3306,
                        user='root',
                        passwd='root',
                        db='social')
    cur = db.cursor()
  except Exception as e:
    print(f'*** database error:\n{e}')
    exit(2) 
  cur.execute("SELECT table_name \
      FROM information_schema.tables \
      WHERE table_type='BASE TABLE' \
      AND table_schema = 'social'")
  tables = list(map(lambda x: x[0], cur.fetchall()))

  def do_EOF(self, line):
    db.close()
    return True
  
  def do_quit(self, args):
    """Quit command to exit the program"""
    db.close()
    return True

  def do_clear(self, args):
    os.system('clear')

  def do_tables(self, args):
    print(CommandLine.tables)

  def do_create(self, args):
    line = args.split(' ')
    if len(line[0]) < 1:
      print('** no table name **')




if __name__ == '__main__':
  if os.geteuid() == 0:
    
    CommandLine().cmdloop()
  else:
    print('** not root user **')
