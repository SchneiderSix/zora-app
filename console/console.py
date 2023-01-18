#!/usr/bin/python3
import MySQLdb
import cmd
import os
import uuid

try:
  if os.geteuid() != 0:
    raise Exception('not root user')
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


class CommandLine(cmd.Cmd):
  prompt = '# '
  tables = set(map(lambda x: x[0], cur.fetchall()))

  def do_EOF(self, line):
    """*** ctrl + d to exit the console"""
    cur.close()
    db.close()
    return True
  
  def do_quit(self, args):
    """*** exit the console"""
    cur.close()
    db.close()
    return True

  def do_clear(self, args):
    """***clear screen"""
    os.system('clear')

  def do_tables(self, args):
    """*** display set with the name of all the tables in the database"""
    print(CommandLine.tables)

  #def do_create(self, args):
  #  """*** create a new row in the database
  #  Usage: create <table_name> <attributes>
  #  Ex: create users nick=John"""
  #  line = args.split(' ')
  #  if len(line[0]) < 1:
  #    print('** no table name **')
  #    return
  #  if args not in CommandLine.tables:
  #    print('** table name not valid **')
  #    return
  #  cur.execute(f'INSERT INTO {line[]}')
    
  def do_delete(self, args):
    """*** delete row in database
    Usage: delete <table_name> <id>"""
    line = args.split(' ')
    if len(line[0]) < 1:
      print('** no table name **')
      return
    if len(line) < 2:
      print('** no id **')
      return
    if line[0] not in CommandLine.tables:
      print('** table name not valid **')
      return
    cur.execute(f'SELECT * FROM {line[0]} WHERE id={line[1]}')
    if cur.fetchone():
      cur.execute(f'DELETE FROM {line[0]} WHERE id={line[1]}')
      return
    print('** no instance found')





if __name__ == '__main__':
  if os.geteuid() == 0:
    CommandLine().cmdloop()
  else:
    print('** not root user **')
