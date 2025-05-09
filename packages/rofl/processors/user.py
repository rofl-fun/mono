class User:
    def __init__(self, display_name: str, uid: str):
        self.display_name = display_name
        self.uuid = uid
        self.joined_groups = []